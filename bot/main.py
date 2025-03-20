import requests
import os
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("API_KEY")

genai.configure(api_key=api_key) # Configure the API key
model = genai.GenerativeModel('gemini-1.5-flash')

def get_text_from_txt(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as text_file:
            text = text_file.read()
        return text
    except FileNotFoundError:
        print(f"The file {file_path} does not exist.")
        return None
    except Exception as e:
        print(f"An error occurred while reading the file: {e}")
        return None

def ask_aura_question(user_question, txt_file_path):
    answer = ""
    try:
        # Get the extracted text from the txt file
        extracted_text = get_text_from_txt(txt_file_path)
        
        if not extracted_text:
            return "Error: Could not retrieve text from file."

        # Modified prompt to instruct the model to give direct answers
        prompt = f"""
        Text: {extracted_text}
        
        Question: {user_question}
        
        Important: Give a direct answer without phrases like "Based on the provided text" or "According to the text." Just provide the answer as if you are the digital assistant described in the text.
        """
        
        response = model.generate_content(prompt)
        print("Answer response: ", response.text)  # Debug print for checking the response
        answer = response.text
    except Exception as e:
        print(f"Error while asking Gemini AI: {e}")
        return f"Error: {e}"
    
    return answer