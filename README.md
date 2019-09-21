# Balloon Trip in Javascript

Play the [game](http://kippl.net/balloon/)

**About**<br>
This Javascript Balloon Trip clone was made as a quick experiment to see if SVGs could be used as building blocks to reasonably replicate 8-bit gameplay on a browser. This method seems viable to a degree, at least on webkit browsers. Given the nature of the game and the manner in which the SVGs are created, object creation and removal is the main bottleneck. Garbage collection slows down gameplay occasionally, depending on the browser and its gc cycle. Some performance boosts could possibly be achieved by creating and destroying SVGs via pure javascript instead of using the SVG.js library. Garbage collection could be kept to a minimum by reducing the number of objects created and destroyed in each game loop cycle. Using HTML5 Canvas to render the screen, will probably still yield more efficient results. However using svgs has advantages such as less code complexity, a more object oriented screen rendering proccess, and simple out of the box image scaling.

**To Do**<br>
- [ ] Refactoring, cleanup
- [ ] Reduce object creation and destruction