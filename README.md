[![NPM](https://nodei.co/npm/tweezr.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/tweezr/)

# **tweezr**

a library to reverse search values within a JSON structure or a javascript object & generate the dot-notation query selectors in context of the specified object. You may also use it to \"walk\" through the structure one step at a time to read/write values. Think of it as a XPath generator of any value that matches with your search keyword.

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
  
  console.log('1. path of 1st node found: ' + result[0].path);
  console.log('2. path of parent node: ' + result[0].parent().path);
  console.log('3. parent node serialized: ' + JSON.stringify(result[0].parent().val()));
  console.log('4. path of previous sibling: ' + result[0].prev().path);
  console.log('5. raw value of previous sibling value: ' + result[0].prev().val());
  console.log('6. path of previous to previous sibling: ' + result[0].prev().prev().path);
  console.log('7. raw value of previous to previous sibling value: ' + result[0].prev().prev().val());
  console.log('8. path of next sibling: ' + result[0].next().path);
  console.log('9. raw value of next sibling value: ' + result[0].next().val());
  console.log('10. path of next to next sibling: ' + result[0].next().next().path);
  console.log('11. raw value of next to next sibling value: ' + result[0].next().next().val());
  console.log('12. addAfter: ' + result[0].addAfter(1111).path);
  console.log('13. add before next sibling: ' + result[0].next().addBefore(2222).path);
  console.log('14. updated object serialized: ' + JSON.stringify(myObj));
  console.log('15. replace a value: ' + result[0].replace([1,2,3]).val());
  console.log('16. updated object: ' + JSON.stringify(myObj));
});
```

### Output
```shell
$ node runner.js

#console.log('1. path of 1st node found: ' + result[0].path);
1. path of 1st node found: myObj['cars'][2]['year'][2]

#console.log('2. path of parent node: ' + result[0].parent().path);
2. path of parent node: myObj['cars'][2]['year']

#console.log('3. parent node serialized: ' + JSON.stringify(result[0].parent().val()));
3. parent node serialized: [2013,2014,2015,2019,2021]

#console.log('4. path of previous sibling: ' + result[0].prev().path);
4. path of previous sibling: myObj['cars'][2]['year'][2]

#console.log('5. raw value of previous sibling value: ' + result[0].prev().val());
5. raw value of previous sibling value: 2015

#console.log('6. path of previous to previous sibling: ' + result[0].prev().prev().path);
6. path of previous to previous sibling: myObj['cars'][2]['year'][2]

#console.log('7. raw value of previous to previous sibling value: ' + result[0].prev().prev().val());
7. raw value of previous to previous sibling value: 2015

#console.log('8. path of next sibling: ' + result[0].next().path);
8. path of next sibling: myObj['cars'][2]['year'][3]

#console.log('9. raw value of next sibling value: ' + result[0].next().val());
9. raw value of next sibling value: 2019

#console.log('10. path of next to next sibling: ' + result[0].next().next().path);
10. path of next to next sibling: myObj['cars'][2]['year'][4]

#console.log('11. raw value of next to next sibling value: ' + result[0].next().next().val());
11. raw value of next to next sibling value: 2021

#console.log('12. addAfter: ' + result[0].addAfter(1111).path);
12. addAfter: myObj['cars'][2]['year'][3]

#console.log('13. add before next sibling: ' + result[0].next().addBefore(2222).path);
13. add before next sibling: myObj['cars'][2]['year'][2]

#console.log('14. updated object serialized: ' + JSON.stringify(myObj));
14. updated object serialized: {"list":"automobiles","cars":[{"make":"bmw","model":"Q3","year":2012},{"make":"honda","model":"city","year":[2001,2004,2009]},{"make":"audi","model":"a4","year":[2013,2014,2222,2015,1111,2019,2021]}],"bikes":[{"make":"kawasaki","model":"ninja300","year":2013}],"dealers":""}

#console.log('15. replace a value: ' + result[0].replace([1,2,3]).val());
15. replace a value: 1,2,3

#console.log('16. updated object: ' + JSON.stringify(myObj));
16. updated object: {"list":"automobiles","cars":[{"make":"bmw","model":"Q3","year":2012},{"make":"honda","model":"city","year":[2001,2004,2009]},{"make":"audi","model":"a4","year":[2013,2014,[1,2,3],2015,1111,2019,2021]}],"bikes":[{"make":"kawasaki","model":"ninja300","year":2013}],"dealers":""}
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
