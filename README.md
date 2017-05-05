[![NPM](https://nodei.co/npm/tweezr.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/tweezr/)

# **tweezr**

a javascript library to reverse lookup values within a javascript object & generate the dot-notation query selectors in context to the specified object. You may also use it to "walk" through the structure one-step-at-a-time.

## Acknowledgments/Credits
* [Piyush Pattanayak](https://www.linkedin.com/in/piyush-pattanayak-0341a59/) - Thank you for helping with method chaining & several other valuable brainstorming sessions.
* [Somasish Sahoo](https://www.linkedin.com/in/somasish/) -  Thank you for the numerous hours of valuable brainstorming sessions.

## Install

`npm install tweezr`

## Usage

### Example JSON
```javascript
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

```javascript
$ cat runner.js

var fs = require('fs');
var tweezr = require('tweezr').init({debug: false});

fs.readFile('auto.json', 'utf8', function(err, data) {
  var myObj = JSON.parse(data);
  var keyword = 2015;
  var result = tweezr.findAll(keyword, myObj, 'myObj');
  
  console.log('\n0. original object serialized: ' + JSON.stringify(myObj));
  console.log('\n1. path of 1st node found: ' + result[0].path);
  console.log('\n2. path of parent node: ' + result[0].parent().path);
  console.log('\n3. parent node serialized: ' + JSON.stringify(result[0].parent().obj));
  console.log('\n\n4. path of previous sibling: ' + result[0].prev().path);
  console.log('5. raw value of previous sibling value: ' + result[0].prev().val());
  console.log('6. path of previous to previous sibling: ' + result[0].prev().prev().path);
  console.log('7. raw value of previous to previous sibling value: ' + result[0].prev().prev().val());
  console.log('\n8. path of next sibling: ' + result[0].next().path);
  console.log('9. raw value of next sibling value: ' + result[0].next().val());
  console.log('\n10. path of next to next sibling: ' + result[0].next().next().path);
  console.log('11. raw value of next to next sibling value: ' + result[0].next().next().val());
  console.log('\n12. addAfter: ' + result[0].addAfter(1111).path);
  console.log('13. add before next sibling: ' + result[0].next().addBefore(2222).path);
  console.log('\n14. updated object serialized: ' + JSON.stringify(myObj));
  console.log('\n15. replace a value: ' + result[0].replace([1,2,3]).val());
  console.log('\n14. updated object: ' + JSON.stringify(myObj));
});
```

### Output
```shell
$ node runner.js

0. original object serialized: {"list":"automobiles","cars":[{"make":"bmw","model":"Q3","year":2012},{"make":"honda","model":"city","year":[2001,2004,2009]},{"make":"audi","model":"a4","year":[2013,2014,2015,2019,2021]}],"bikes":[{"make":"kawasaki","model":"ninja300","year":2013}],"dealers":""}

1. path of 1st node found: myObj.cars[2].year[2]

2. path of parent node: myObj.cars[2].year

3. parent node serialized: {"list":"automobiles","cars":[{"make":"bmw","model":"Q3","year":2012},{"make":"honda","model":"city","year":[2001,2004,2009]},{"make":"audi","model":"a4","year":[2013,2014,2015,2019,2021]}],"bikes":[{"make":"kawasaki","model":"ninja300","year":2013}],"dealers":""}


4. path of previous sibling: myObj.cars[2].year[2]
5. raw value of previous sibling value: 2015
6. path of previous to previous sibling: myObj.cars[2].year[2]
7. raw value of previous to previous sibling value: 2015

8. path of next sibling: myObj.cars[2].year[3]
9. raw value of next sibling value: 2019

10. path of next to next sibling: myObj.cars[2].year[4]
11. raw value of next to next sibling value: 2021

12. addAfter: myObj.cars[2].year[3]
13. add before next sibling: myObj.cars[2].year[2]

14. updated object serialized: {"list":"automobiles","cars":[{"make":"bmw","model":"Q3","year":2012},{"make":"honda","model":"city","year":[2001,2004,2009]},{"make":"audi","model":"a4","year":[2013,2014,2222,2015,1111,2019,2021]}],"bikes":[{"make":"kawasaki","model":"ninja300","year":2013}],"dealers":""}

15. replace a value: 1,2,3

14. updated object: {"list":"automobiles","cars":[{"make":"bmw","model":"Q3","year":2012},{"make":"honda","model":"city","year":[2001,2004,2009]},{"make":"audi","model":"a4","year":[2013,2014,[1,2,3],2015,1111,2019,2021]}],"bikes":[{"make":"kawasaki","model":"ninja300","year":2013}],"dealers":""}
```

# Documentation

## .init( _{debug: boolean}_ )

## .findAll(varKeyword, objContextObject, strContextObjectLiteral)
**Returns:** An array of selector objects    
**Arguments**:    
    - **varKeyword**: The item to be searched, sensitive of data-type and value    
    - **objContextObject**: The identifier of the _haystack_ object (i.e. the object to search in)    
    - **strContextObjectLiteral**: The literal value of the _haystack_ object identifier     

## .path
**Type:** Attribute    
**Value:** the dot-notation selector query in context to objContextObject    

## .obj
**Type:** Attribute    
**Value:** unserialized value of objContextObject    

## .val()
**Type:** Getter    
**Returns:** The raw value of the current selector    

## .parent()
**Type:** Getter     
**Returns:** the parent node of the current selector    

## .prev()
**Type:** Getter    
**Returns:** the previous node of the current selector    

## .next()
**Type:** Getter    
**Returns:** the next node of the current selector     

## .addAfter(varToInsert)
**Type:** Setter    
**Sets:** Sets varToInsert as the raw value of the next node of the current selector      
**Returns:** the selector object of the newly added node    

## .addBefore(varToInsert)
**Type:** Setter    
**Sets:** Sets varToInsert as the raw value of the previous node of the current selector    
**Returns:** the selector object of the newly added node    

## .replace(varToReplace)
**Type:** Setter    
**Sets:** Sets varToInsert as the raw value of the currently selected node    
**Returns:** the selector object of the same node    
