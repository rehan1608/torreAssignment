from flask import Flask, jsonify
from flask_cors import CORS
import requests
import html
import urllib.parse
import json
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3000",
    "https://torre-search-app.netlify.app",  # Add your Netlify domain here
    os.getenv("FRONTEND_URL", "")  # Allow configuring additional domains via env var
]}})

@app.route('/api/search/<name>')
def search_users(name):
    try:
        # Using Torre's search API endpoint
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        payload = {
            "query": name,
            "identityType": "person",
            "meta": False,
            "limit": 100,  # Increased limit to get more results
            "excludeContacts": False,
            "excludedPeople": []
        }
        
        # Default profile picture URL
        default_picture = "https://res.cloudinary.com/torre-technologies-co/image/upload/v1621443046/origin/starrgate/users/profile_default.jpg"
        
        response = requests.post('https://arda.torre.co/entities/_search', json=payload, headers=headers)
        
        if response.status_code == 200:
            try:
                data = response.json()
                # Extract and format the results
                people = []
                results = data.get('results', [])
                
                if results and isinstance(results, list):
                    for result in results:
                        if isinstance(result, dict):
                            # Safely handle None values before html.unescape
                            name = html.unescape(result.get('name', '')) if result.get('name') else ''
                            headline = html.unescape(result.get('professionalHeadline', '')) if result.get('professionalHeadline') else ''
                            
                            # Use default picture if none is provided
                            picture = result.get('picture') or result.get('imageUrl')
                            if not picture:
                                picture = default_picture
                            
                            person = {
                                'username': result.get('username', ''),
                                'name': name,
                                'professionalHeadline': headline,
                                'picture': picture
                            }
                            if person['name'] or person['username']:
                                people.append(person)
                
                if people:
                    # Calculate pagination info
                    total_results = len(people)
                    total_pages = (total_results + 4) // 5  # Ceiling division by 5
                    
                    return jsonify({
                        'success': True,
                        'data': {
                            'results': people,
                            'pagination': {
                                'total_results': total_results,
                                'total_pages': total_pages,
                                'items_per_page': 5
                            }
                        }
                    })
                else:
                    return jsonify({'success': False, 'message': 'No matching names found'})
                    
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {str(e)}")
                return jsonify({'success': False, 'message': 'Error processing search results'})
        elif response.status_code == 429:
            return jsonify({'success': False, 'message': 'Rate limit exceeded. Please try again later.'})
        else:
            return jsonify({'success': False, 'message': f'Search failed with status code: {response.status_code}'})
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'success': False, 'message': 'An error occurred while searching. Please try again.'})

@app.route('/api/user/<username>')
def get_user_details(username):
    try:
        # URL encode the username to handle spaces and special characters
        encoded_username = urllib.parse.quote(username)
        response = requests.get(f'https://torre.ai/api/genome/bios/{encoded_username}')
        if response.status_code == 200:
            data = response.json()
            person_data = data.get('person', {})
            # Extract detailed info and decode HTML entities
            person = {
                'name': html.unescape(person_data.get('name', '')),
                'professionalHeadline': html.unescape(person_data.get('professionalHeadline', '')),
                'summaryOfBio': html.unescape(person_data.get('summaryOfBio', '')),
                'location': html.unescape(person_data.get('location', {}).get('name', '')),
                'picture': person_data.get('picture', ''),
                'links': data.get('person', {}).get('links', [])  # Add links to the response
            }
            return jsonify({'success': True, 'data': person})
        else:
            return jsonify({'success': False, 'message': 'Not enough data available'})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True) 