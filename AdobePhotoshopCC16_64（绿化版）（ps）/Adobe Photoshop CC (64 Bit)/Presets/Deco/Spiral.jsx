//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Here are a few parameters that you can change to modify the behavior of the patterm
// Feel free to modify the values, don't change the variable names

// Offset in pixels between two rings of the spiral
// Value of 1 will create tightly packed spiral, higher value will create bigger gap between spiral rings
var offset = 0    // use a value between 0 and 100. The default is 0.

// Controls how close the elements are along the spiral. 
// Use value from 0.3 to 1.5, it is a multiplicative factor for the angle between subsequent segments.
// The default is 1.
var angleFactor = 1 

// Add spacing in pixels around each patterns in pixels. Note that this value will increase the offset between spiral rings
var spacing = 0   // use a value between -10 to 20. The default is 0.

///////////////////////////////////////////////////////////////////////////

// get size of the output area
var outputSize = RenderAPI.getParameter(kpsSize)

// Get pattern  and its size
var pattern = RenderAPI.getParameter(kpsPattern)

var patternSize = pattern.getParameter(kpsSize)

//pattern.setParameter(kpsMaxPatternCacheSize, patternSize.x * patternSize.y * 7 * 8 * 180)

// possibly add spacing
patternSize.x += spacing
patternSize.y += spacing

// scale up if the patternsize is 1 to avoid long loop
var scale = 1
var skipRotation = false 

if (patternSize.x == 1 && patternSize.y == 1)
{
    scale = 20
    patternSize *= scale
    skipRotation = true    // 1x1 patterns that are scaled up do not rotate gracefully
}


 var angle = -90
 var angleStep
 

RenderAPI.translate(outputSize.x / 2, outputSize.y / 2)
 
var num = 0
var diagonal = Math.sqrt(outputSize.x*outputSize.x + outputSize.y*outputSize.y) * 0.5 
                      + Math.sqrt(patternSize.x * patternSize.x + patternSize.y *patternSize.y)  * 0.5

for (var radius = 0; Math.abs(radius) <  diagonal ; )
{
   
     radius = patternSize.y/2 + ((patternSize.y-1+offset) / 360) * angle  // In one revolution (360 degrees) we want to add patternSize.y to the radius
     angleStep = 360 / ( 6.28 * (radius - patternSize.y/2)/ (patternSize.x)) * angleFactor
     
     RenderAPI.pushMatrix()
    
     // rotate around the center of the selection 
     RenderAPI.translate(-outputSize.x / 2, -outputSize.y / 2)
     RenderAPI.rotate(angle)
     RenderAPI.translate(outputSize.x / 2, outputSize.y / 2)
    
    RenderAPI.translateRel(0, radius)   // translate relative to the rotated frame
    RenderAPI.scale (scale, scale)
    
    if (skipRotation)
        // cancel the rotation above
        RenderAPI.rotate(-angle)
    else
        // Adjust the rotation set above so that the pattern itself is rotated only in multiples of 2 degrees
        RenderAPI.rotate( - angle + 2 * Math.floor(0.5+angle/2)) 
        
    pattern.render(RenderAPI)
    
    RenderAPI.popMatrix()
 
    angle += angleStep
}
 




