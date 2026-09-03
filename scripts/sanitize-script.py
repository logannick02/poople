from wordfreq import word_frequency, zipf_frequency
import json
validAnswers = []
validStarterWords = []


with open("./scrabble-unsanitized.txt", "r") as file:
    content = file.read()
    # print(content)
    
    for word in content.split():
        # print(zipf_frequency(word, 'en'))
        
        if zipf_frequency(word, 'en') > 3.25:
            validStarterWords.append(word)
        
        if zipf_frequency(word, 'en') > 2.25:
            validAnswers.append(word)
    
with open("starter.json", "w") as file:
    json.dump(validStarterWords, file)

with open("answers.json", "w") as file:
    json.dump(validAnswers, file)
