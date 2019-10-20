<h1>WeeWaze API
</h1>

Use this API to dynamically generate traffic maps of San Francisco based on your query parameters.  The maps are generated from 87GB of historical GPS data from SFMTA. 

## Get a Map for a Smaller Area Inside San Francisco

### Request

```
GET http://bit.ly.WeeWaze/api/fullMap/area
```

### Parameters

| Name   | Type  | Description                                                  |
| ------ | ----- | ------------------------------------------------------------ |
| latmin | float | The smallest latitude in your area range; please pick a number between -122.513 and -122.358. |
| latmax | float | The largest latitude in your area range; please pick a number between -122.513 and -122.358. |
| lonmin | float | The smallest longitude in your area range; please pick a number between 37.709 and 37.807. |
| lonmax | float | The largest longitude in your area range; please pick a number between 37.709 and 37.807. |

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

| Name | Type   | Description                                                  |
| ---- | ------ | ------------------------------------------------------------ |
| min  | string | The smallest day in your date range; please pick a day of the week or a number between 0 and 6. |
| max  | string | The biggest day in your date range; please pick a day of the week or a number between 0 and 6. |

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

| Name | Type   | Description                                                  |
| ---- | ------ | ------------------------------------------------------------ |
| min  | string | The smallest hour in your hour range; please pick a number between 0 and 23. |
| max  | string | The smallest hour in your hour range; please pick a number between 0 and 23. |

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

| Name    | Type   | Description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| latmin  | float  | The smallest latitude in your area range; please pick a number between -122.513 and -122.358. |
| latmax  | float  | The largest latitude in your area range; please pick a number between -122.513 and -122.358. |
| lonmin  | float  | The smallest longitude in your area range; please pick a number between 37.709 and 37.807. |
| lonmax  | float  | The largest longitude in your area range; please pick a number between 37.709 and 37.807. |
| daymin  | string | The smallest day in your date range; please pick a day of the week and a number between 0 and 6. |
| daymax  | string | The biggest day in your date range; please pick a day of the week and a number between 0 and 6. |
| hourmin | string | The smallest hour in your hour range; please pick a number between 0 and 23. |
| hourmax | string | The largest hour in your hour range; please pick a number between 0 and 23. |

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

| Name    | Type   | Description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| day     | string | A day of the week; please pick a number between 0 and 6.     |
| hourmin | string | The smallest hour in your hour range; please pick a number between 0 and 23. |
| hourmax | string | The largest hour in your hour range; please pick a number between 0 and 23. |

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

| Name    | Type   | Description                                                  |
| ------- | ------ | ------------------------------------------------------------ |
| day     | string | A day of the week; please pick a number between 0 and 6.     |
| hourmin | string | The smallest hour in your hour range; please pick a number between 0 and 23. |
| hourmax | string | The largest hour in your hour range; please pick a number between 0 and 23. |

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
"The server is healthy."
```