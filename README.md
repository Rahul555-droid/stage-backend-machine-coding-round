# OTT Platform "My List" Feature - Developer Evaluation Project

You can see detailed changes in my code in a draft PR here => https://github.com/Rahul555-droid/stage-backend-machine-coding-round/pull/1/files
below is a small summary.

## Changes Made :
1. Implemented all the list apis => GET list , POST list , DELETE list. Added all the validations possible to the APIs . So the client will always know the issue.
2. Added authentication logic as well via an auth gaurd which validates the api call . This auth gaurd is only active on list controller
3. Also added user creation (registration) and user verification (login) flow.
4. Fixed seeding issue, Fixed date string issue among other bugs in code.
5. Wrote modular and cleaner code.

## Output

POST list
![image](https://github.com/user-attachments/assets/77747cb9-e9b5-4212-9638-9fe6c03f65f0)

GET list
![image](https://github.com/user-attachments/assets/bc2e3f2b-1948-4584-8c6e-8d017c5748f7)

DELETE list
![image](https://github.com/user-attachments/assets/e204e423-11a1-424a-aec2-17027450fa2e)

login 
![image](https://github.com/user-attachments/assets/fd943d8e-b5c0-45bb-b89c-0880976f5d26)

register
![image](https://github.com/user-attachments/assets/72cbb088-80b1-4523-a117-a7e157421477)


## Potential Improvements 
1. Adding node cache
2. Unit testing
