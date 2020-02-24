<h1>WeeWaze API
</h1>

Use this API to dynamically generate traffic maps of San Francisco based on your query parameters.  The maps are generated from 87GB of historical GPS data from SFMTA. 

## Get a Map for a Smaller Area Inside San Francisco

### Request

```
GET http://bit.ly.WeeWaze/api/fullMap/area
```

### Parameters

| Name           | Type  | Description                                                 |
| -------------- | ----- | ----------------------------------------------------------- |
| latmin, latmax | float | Please pick a decimal number between -122.513 and -122.358. |
| lonmin, lonmax | float | Please pick a decimal number between 37.709 and 37.807.     |

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

## Get a Map for a Day Range

### Request

```
GET http://bit.ly.WeeWaze/api/fullMap/day
```

### Parameters

| Name     | Type   | Description                                                |
| -------- | ------ | ---------------------------------------------------------- |
| min, max | string | Please pick an integer between 0 and 6, where 0 is Sunday. |

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

## Get a Map for an Hour Range

### Request

```
GET http://bit.ly.WeeWaze/api/fullMap/hour
```

### Parameters

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| min, max | string | Take the floor to the nearest hour; for example, the correct time for 23:59 should be 23.  Min, max should be integers between 0 and 23 |

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

## Get a Map Varying all Three Parameters

### Request

```
GET http://bit.ly.WeeWaze/api/fullMap/all
```

### Parameters

| Name             | Type   | Description                                                  |
| ---------------- | ------ | ------------------------------------------------------------ |
| latmin, latmax   | float  | Please pick a decimal number between -122.513 and -122.358.  |
| lonmin, lonmax   | float  | Please pick a decimal number between 37.709 and 37.807.      |
| daymin, daymax   | string | Please pick an integer between 0 and 6, where 0 is Sunday.   |
| hourmin, hourmax | string | Take the floor to the nearest hour; for example, the correct time for 23:59 should be 23.  hourmin, hourmax should be integers between 0 and 23. |

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

## Get a Default Map Using the Full Dataset

### Request

```
GET http://bit.ly.WeeWaze/api/fullMap
```

### Parameters

| Name             | Type   | Description                                                  |
| ---------------- | ------ | ------------------------------------------------------------ |
| day              | string | Please pick an integer between 0 and 6, where 0 is Sunday.   |
| hourmin, hourmax | string | Take the floor to the nearest hour; for example, the correct time for 23:59 should be 23.  hourmin, hourmax should be integers between 0 and 23. |

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

## Get the Default Map Using a Partial Dataset

### Request

```
GET http://bit.ly.WeeWaze/api/partMap
```

### Parameters

| Name              | Type   | Description                                                  |
| ----------------- | ------ | ------------------------------------------------------------ |
| day               | string | Please pick an integer between 0 and 6, where 0 is Sunday.   |
| hourmin , hourmax | string | Take the floor to the nearest hour; for example, the correct time for 23:59 should be 23.  hourmin, hourmax should be integers between 0 and 23. |

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