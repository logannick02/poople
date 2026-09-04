import json, random
from collections import deque
from datetime import date

def one_away(w1, w2):
    diff = 0

    for l1, l2 in zip(w1, w2):
        if l1 != l2:
            diff += 1
    
    if diff == 1:
        return True
    
    return False

def bfs(start, end, wordSet):
    q = deque([[start]])
    visited = {start}

    while q:
        path = q.popleft()
        cur = path[-1]

        if cur == end:
            return path
        
        for word in wordSet:
            if word not in visited and one_away(cur, word):
                visited.add(word)
                q.append(path + [word])
    
    return None


with open("./src/data/starter.json", "r") as file:
    startOptions = json.load(file)

with open("./src/data/answers.json", "r") as file:
    answerOptions = json.load(file)

startWord = startOptions[random.randint(0, len(startOptions)-1)]
path = bfs(startWord, "POOP", answerOptions)

# for determining the day count
start_date = date(2026, 8, 31)

cur_date = date.today()

delta = cur_date - start_date

wordData = {"day": delta.days, "word": startWord, "bestPathLength": len(path)-1}

print(wordData)
print(path)

with open("./src/data/dailyWord.json", "w") as file:
    json.dump(wordData, file)
