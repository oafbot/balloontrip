# Balloon Trip in Javascript

*play the [game](http://kippl.net/balloon/)*
<br>
<br>
[![screenshot](http://kippl.net/balloon/images/screenshot.png "click to goto game.")](http://kippl.net/balloon/)

**About**<br>
This Javascript Balloon Trip clone was made as a quick experiment to see if SVGs could be used as building blocks to reasonably replicate 8-bit gameplay on a browser. Using HTML5 Canvas to render the screen, will probably still yield more efficient results. However using svgs has advantages such as less code complexity, a more object oriented screen rendering proccess, and simple out of the box image scaling. This method seems viable to a degree, at least on webkit browsers. Garbage collection and object creation / destruction routines appears not to be the main bottleneck as *[previously speculated](https://github.com/oafbot/balloontrip/blob/6b7ae8b1966377638bdb855bf6e2663e0a94bd10/README.md)*. Rewriting main.js to recycle sprites produces no significant improvement over the *[previous gameplay](http://kippl.net/balloon-v1/)* experience. The game seems to suffer from inconsistent frame rates in Safari. This could be because of the way `requestAnimationFrame()` is implemented in the browser, or the way the layout engine handles SVGs. Possible fix for this might be to change the game loop to handle fps inconsistencies in a more robust manner. The game plays fine on Chromium based browsers, with Edge (OS X version) performing slightly better than Chrome. The game renders, but is too slow on Firefox. Given some of the above observations and output from some performance tests, the bottleneck actually seems mostly just the screen rendering process itself. If a routine is written to merge and flatten the svg rectangles into compound paths on initialization, some rendering cycles could probably be saved at runtime.


**To Do**<br>
- [ ] Refactoring, cleanup
- [x] Reduce object creation and destruction
- [ ] Add routine to merge and flatten svg "bits" into paths
- [ ] Modify game loop to produce more consistent frame rates in Safari