from wordfreq import word_frequency, zipf_frequency
import json
validAnswers = []

with open("./scrabble-unsanitized.txt", "r") as file:
    content = file.read()
    # print(content)
    
    for word in content.split():
        # print(zipf_frequency(word, 'en'))
              
        if zipf_frequency(word, 'en') > 2.0:
            validAnswers.append(word)
    
with open("./src/data/answers.json", "w") as file:
    json.dump(validAnswers, file)
