import json, string
from collections import deque
letters = list(string.ascii_uppercase)

validStarterList = set()


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
    paths = [] # all possible paths
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



with open("./starter.json", "r") as file:
    data = json.load(file)
    wordSet = set(data)

    with open("./src/data/starter.json", "w") as f2:
        validStarts = []

        for word in wordSet:
            path = bfs(word, "POOP", wordSet)

            if path is not None:
                validStarts.append(word)
        
        json.dump(validStarts, f2)


    