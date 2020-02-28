<h1>WeeWaze API
</h1>

Use this API to  generate traffic maps of San Francisco.  The maps are generated from 87GB of historical GPS data from SFMTA. 

## Get a Map 

### Request

```
GET http://bit.ly.WeeWaze/api/v1/resources/maps
```

### Parameters

| Name             | Type    | Required | Description                                                  |
| ---------------- | ------- | :------: | ------------------------------------------------------------ |
| display          | boolean |  false   | is the map for display?                                      |
| lonmin, lonmax   | float   |  false   | a decimal number between -122.513 and -122.358.              |
| latmin, latmax   | float   |  false   | a decimal number between 37.709 and 37.807.                  |
| daymin, daymax   | string  |  false   | an integer between 0 and 6, where 0 is Sunday.               |
| hourmin, hourmax | string  |  false   | an integers between 0 and 23.  (the correct time for 23:59 should be 23) |

<h3>Response

```
[
        {
            "x": "717.324",
            "y": "356.815",
            "bucket": 3,
            "longitude": -122.392,
            "latitude": 37.765,
            "speed": "23.189"
        },
   		...
   ]
```

## Check the Health of the Server

### Request

```
GET http://bit.ly.WeeWaze/api/ping
```

### Parameters

```
None
```

<h3>Response

```
"The server is alive! Thanks for checking!""
```