# 📊Fake Server

This server is the back-end for the Savings Dashboard project and utilises Node.js and Express

### 📋Aims of App

- Enable the front-end to be able to pull data stored in the API through various different end points, such as budget and category
- Random timestamps and values for each end point with budget and category

### 👩‍💻Technical Details

- Node.js
- Express Server
- Date-fns
- AWS

### 🔧How to Run the App

- Open up a terminal and run :`npm install`
- To run this API locally: `npm run start`
- To view the server end-points deployed on AWS:
  https://bejicmji8c.execute-api.eu-central-1.amazonaws.com/latest/savings?split-by=budget

https://bejicmji8c.execute-api.eu-central-1.amazonaws.com/latest/savings?split-by=cateogry

### 💭Future Improvements

- More end-points as front-end functionality increases
- Change typos
- Allow the user to see random values for each end point within budget and category
