

# fishfinder
a mobile instance of an arcgis map that I use to track all the gps coordinates of fish I have caught

#How fish finder works
by submitting a form inside my vue app, the user sends an object such as the following to my server:

```
let fish = {
date: '',
coords: ['21.45743', '-76.34257'],
species: ''
}
```

the server then stores the object as a document within a mongoDB database using the mongodb node.js driver

when the map reloads, all the points where a fish was added will be rendered into the map

#security and package inclusion
I have not used a git ignore file to remove any data as this project is not hosted and contains no sensitive information.
The geo-location points are also random and not of any value.
