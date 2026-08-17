console.log("ImageLoadBar – Extention loaded");
function ImageLoadBar_hook(ctx, width, height, total, current, image)
{
	// Width and Height Set
	width = window.innerWidth * window.devicePixelRatio;
	height = window.innerHeight * window.devicePixelRatio;

	// Loading Screen Set
	var loadingScreenId = document.getElementById("loading_screen");
	loadingScreenId.width = width;
	loadingScreenId.height = height;
	loadingScreenId.style = "touch-action: none; width: " + window.innerWidth + "px; height: " + window.innerHeight + "px; cursor: auto;";
	
	// Image Scale by Screen
	imageScale = height / 1080;
	if (height > width)
	{
		imageScale = height / 1920;
	}

	// Background Set
	var backgroundColor = "#32B9F5";
	var barBackgroundColor = "#32B9F5";
	var barForegroundColor = "#FFFFFF";
	var barBorderColor = "#FFFFFF";

	// Bar Set
	var barWidth = Math.round(width * 0.4);
	if (height > width)
	{
		barWidth = Math.round(width * 0.9);
	}
	var barHeight = Math.round(40 * imageScale);
	var barBorderWidth = Math.round(4 * imageScale);
	var barOffset = Math.round(20 * imageScale);

	// Background Draw
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0, 0, width, height);

	// Image Set and Draw
	var totalHeight, barTop;
	var drawWidth = image.width * imageScale;
	var drawHeight = image.height * imageScale;
	if (image != null)
	{
		totalHeight = drawHeight + barOffset + barHeight;
		var image_x = (width - drawWidth) * 0.5;
		var image_y = (height - drawHeight) * 0.4;
		ctx.drawImage(image, image_x, image_y, drawWidth, drawHeight);
		barTop = image_y + drawHeight + barOffset;
	}
	else
	{
		barTop = (height - barHeight) * 0.5;
	}

	// Bar Border Draw
	var barLeft = (width - barWidth) * 0.5;
	ctx.fillStyle = barBorderColor;
	ctx.fillRect(barLeft, barTop, barWidth, barHeight);
	
	// Bar Inner Set
	var barInnerLeft = barLeft + barBorderWidth;
	var barInnerTop = barTop + barBorderWidth;
	var barInnerWidth = barWidth - barBorderWidth * 2;
	var barInnerHeight = barHeight - barBorderWidth * 2;

	// Bar Background Draw
	ctx.fillStyle = barBackgroundColor;
	ctx.fillRect(barInnerLeft, barInnerTop, barInnerWidth, barInnerHeight);

	// Bar Inner Draw
	var barLoadedWidth = Math.round(barInnerWidth * current / total);
	ctx.fillStyle = barForegroundColor;
	ctx.fillRect(barInnerLeft, barInnerTop, barLoadedWidth, barInnerHeight);

	// Debug Percent
	console.log("Loading: " + current + "/" + total);
}