import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import './CanvasEditor.css';

class CanvasEditor {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.image = null;
        this.text = {
            line1: '1 & 2 BHK Luxury Apartments at',
            line2: 'just Rs.34.97 Lakhs',
            cta: 'Shop Now'
        };
        this.backgroundColor = '#0369A1';
        this.scaleFactor = 90 / 100; 
    }

    setBackgroundImage(imageSrc) {
        this.image = new Image();
        this.image.src = imageSrc;
        this.image.onload = () => {
            this.renderCanvas();
        };
    }

    setText(line1, line2, cta) {
        this.text.line1 = line1;
        this.text.line2 = line2;
        this.text.cta = cta;
        this.renderCanvas();
    }

    setBackgroundColor(color) {
        this.backgroundColor = color.hex;
        this.renderCanvas();
    }

   renderCanvas() {
        const { ctx, canvas, text, image, backgroundColor, scaleFactor } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Draw background color
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Draw text
        ctx.fillStyle = '#FFFFFF'; 
        ctx.font = 'bold 35px Arial'; 
        ctx.textAlign = 'center'; 
        ctx.textBaseline = 'top';  
        const textHeight = 34; 
        const marginTop = 20; 

        ctx.fillText(text.line1, canvas.width / 2, marginTop); 
        ctx.fillText(text.line2, canvas.width / 2, marginTop + textHeight); 

        //"Shop Now" button
        const ctaWidth = ctx.measureText(text.cta).width;
        const ctaX = (canvas.width - ctaWidth) / 2;
        const ctaY = marginTop + textHeight * 2 + 10; // Add padding
        ctx.fillStyle = '#FFFFFF'; // Change button background color
        ctx.fillRect(ctaX - 10, ctaY - 5, ctaWidth + 20, textHeight + 10); // Draw button background
        ctx.fillStyle = '#0369A1'; // Change button text color to white
        ctx.fillText(text.cta, canvas.width / 2, ctaY); // Draw "Shop Now" text

        //Draw image
        if (image) {
            const imgWidth = canvas.width * scaleFactor * 0.8; // 80% of canvas width
            const imgHeight = canvas.height * scaleFactor * 0.8; // 80% of canvas height
            const x = (canvas.width - imgWidth) / 2; // Center image horizontally
            const y = (canvas.height - imgHeight) / 2; // Center image vertically
            ctx.drawImage(image, x, y, imgWidth, imgHeight);
        }
    }
}

const CanvasComponent = () => {
    const canvasRef = useRef(null);
    const [canvasEditor, setCanvasEditor] = useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [recentColors, setRecentColors] = useState(['#029e9e', '#750e68', '#001163', '#629e02', '#940000']);
    const [currentColor, setCurrentColor] = useState('#0369A1');

    useEffect(() => {
        const editor = new CanvasEditor('canvas');
        setCanvasEditor(editor);
        editor.renderCanvas(); // Render canvas with default background color on page load
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            canvasEditor.setBackgroundImage(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleTextChange = (line1, line2, cta) => {
        canvasEditor.setText(line1, line2, cta);
    };

    const handleBackgroundColorChange = (color) => {
        setCurrentColor(color.hex);
        canvasEditor.setBackgroundColor(color);
    };

    const handleColorSelection = (color) => {
        setCurrentColor(color);
        canvasEditor.setBackgroundColor({ hex: color });
        setShowColorPicker(false);
    };

    const handleColorPickerToggle = () => {
        setShowColorPicker(!showColorPicker);
    };

    const handleAddToRecentColors = () => {
        if (!recentColors.includes(currentColor)) {
            setRecentColors([currentColor, ...recentColors.slice(0, 4)]);
        }
        setShowColorPicker(true);
    };

    return (
        <div className="canvas-container">
            <div className="canvas-editor">
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                <input type="text" placeholder="Line 1" onChange={(e) => handleTextChange(e.target.value, canvasEditor.text.line2, canvasEditor.text.cta)} />
                <input type="text" placeholder="Line 2" onChange={(e) => handleTextChange(canvasEditor.text.line1, e.target.value, canvasEditor.text.cta)} />
                <input type="text" placeholder="Call to Action" onChange={(e) => handleTextChange(canvasEditor.text.line1, canvasEditor.text.line2, e.target.value)} />

                <button className="color-picker-toggle" onClick={handleColorPickerToggle}>
                    Choose your Colour
                </button>

                <div className="color-picker">
                    <div className="recent-colors">
                        {recentColors.map((color, index) => (
                            <div
                                key={index}
                                className="color-box"
                                style={{ backgroundColor: color, borderRadius: '50%', width: '15px', height: '15px', cursor: 'pointer', display: 'inline-block', marginRight: '5px' }}
                                onClick={() => handleColorSelection(color)}
                            ></div>
                        ))}
                    </div>

                    <button className="add-color-button" onClick={handleAddToRecentColors}>
                        +
                    </button>
                </div>

                {showColorPicker && (
                    <SketchPicker
                        color={currentColor}
                        onChange={handleBackgroundColorChange}
                        presetColors={recentColors}
                    />
                )}
            </div>
            <canvas ref={canvasRef} id="canvas" width={1080} height={1080} style={{ width: '400px', height: '400px' }} />
        </div>
    );
};

export default CanvasComponent;
