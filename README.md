# Fusion UI

This is main menu UI project for [Venice Unleashed](http://playvu.com).

## Building

Install node.js and run these commands in the root directory of the project:

```
npm install
npm run build
```

Copy the produced `ui.vuic` to `%LocalAppData%/VeniceUnleashed/client/vu` (or `<VU Installation Dir>/vu` if in a non-standard location).

> NOTE: Every time you start VU it will download the latest main menu `vuic` and replace your own on the next restart. You might be able to work around this by setting the `vu.vuic` file as read-only.

## Developing

After doing an `npm install`, run the following command in the root directory of the project:

```
npm start
```

The UI should automatically open up in your browser with some test data loaded in. You can manage the test data by editing `app/test.js`.