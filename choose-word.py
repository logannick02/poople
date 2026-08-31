import json, random
from collections import deque

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
    
    return paths


with open("./src/data/starter.json", "r") as file:
    options = json.load(file)

idx = random.randint(0, len(options)-1)

path = bfs(options[idx], "POOP", options)

print(f"Shortest path for {options[idx]} is {len(path)}")
print(path)


