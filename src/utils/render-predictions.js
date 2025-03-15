export const renderPredictions = (predictions, ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const font = '16px sans-serif';
    ctx.font = font;
    ctx.textBaseline = 'top';

    predictions.forEach((prediction) => {
        const [x, y, width, height] = prediction['bbox'];

        // Bounding box
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        // Fill color (only for people)
        ctx.fillStyle = 'rgba(153, 207, 255, 0.2)';
        ctx.fillRect(x, y, width, height);

        // Draw label background
        let confidence = Math.trunc(prediction.score * 100);
        ctx.fillStyle = '#00FFFF';
        const text = `${prediction.class} || ${confidence}%`;
        const textWidth = ctx.measureText(text).width;
        const textHeight = parseInt(font, 10);
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

        // Text
        ctx.fillStyle = '#000000';
        ctx.fillText(text, x, y);
    });
};
