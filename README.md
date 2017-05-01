# **tweezr**

a javascript library to reverse lookup values within a javascript object & generate the dot-notation query selectors in context to the specified object. You may also use it to "walk" through the structure one-step-at-a-time.


## Acknowledgments/Credits
* [Piyush Pattanayak](https://www.linkedin.com/in/piyush-pattanayak-0341a59/) - Thank you for helping with method chaining & several other valuable brainstorming sessions.
* [Somasish Sahoo](https://www.linkedin.com/in/somasish/) -  Thank you for the numerous hours of valuable brainstorming sessions.

## Install

`npm install tweezr`

## Usage

### Example JSON
```
$ cat auto.json
 
{
  "list": "automobiles",
  "cars": [
    {
      "make": "bmw",
      "model": "Q3",
      "year": 2012
    },
    {
      "make": "honda",
      "model": "city",
      "year": [
        2001,
        2004,
        2009
      ]
    },
    {
      "make": "audi",
      "model": "a4",
      "year": [
        2013,
        2014,
        2015,
        2019,
        2021
      ]
    }
  ],
  "bikes": [
    {
      "make": "kawasaki",
      "model": "ninja300",
      "year": 2013
    }
  ],
  "dealers": ""
}
```



### Example Usage

```
$ cat runner.js

var fs = require('fs');
var tweezr = require('tweezr').init();

fs.readFile("auto.json", 'utf8', function(err, data) {
  var myObj = JSON.parse(data);
  var keyword = 2015;
  var result = tweezr.findAll(keyword, myObj, "myObj");
  
  console.log("\n1. current node: " + result[0].path);
  console.log("\n2. parent node: " + result[0].parent().path);
  console.log("\n3. parent node serialized: " + JSON.stringify(result[0].parent().obj));
  console.log("\n\n4. previous sibling: " + result[0].prev().path);
  console.log("5. previous sibling value: " + result[0].prev().val());
  console.log("6. previous to previous sibling: " + result[0].prev().prev().path);
  console.log("7. previous to previous sibling value: " + result[0].prev().prev().val());
  console.log("\n8. next sibling: " + result[0].next().path);
  console.log("9. next sibling value: " + result[0].next().val());
  console.log("\n10. next to next sibling: " + result[0].next().next().path);
  console.log("11. next to next sibling value: " + result[0].next().next().val());
});
```

### Output
```
$ node runner.js


1. current node: myObj.cars[2].year[2]

2. parent node: myObj.cars[2].year

3. parent node serialized: {"list":"automobiles","cars":[{"make":"bmw","model":"Q3","year":2012},{"make":"honda","model":"city","year":[2001,2004,2009]},{"make":"audi","model":"a4","year":[2013,2014,2015,2019,2021]}],"bikes":[{"make":"kawasaki","model":"ninja300","year":2013}],"dealers":""}


4. previous sibling: myObj.cars[2].year[1]
5. previous sibling value: 2014
6. previous to previous sibling: myObj.cars[2].year[0]
7. previous to previous sibling value: 2013

8. next sibling: myObj.cars[2].year[3]
9. next sibling value: 2019

10. next to next sibling: myObj.cars[2].year[4]
11. next to next sibling value: 2021
```



