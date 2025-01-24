import React, { useState, useRef, useEffect } from 'react';


const BoxDrawer = ({ imageURL, prediction, originalShape }) => {
    const canvasRef1 = useRef(null); // Для обычных боксов
    const canvasRef2 = useRef(null); // Для заполненных боксов
    const boxes = prediction.boxes;

    const classColors = {
        'A1': '255,0,0',   // красный
        'A2': '0,0,255',   // синий
        'A3': '0,128,0',   // зеленый
        'B4': '255,255,0', // желтый
        'B5': '128,0,128', // пурпурный
        'C6': '255,165,0', // оранжевый
        'C7': '0,255,255', // циан
        'C8': '255,0,255', // магента
        'C9': '0,255,0',   // лайм
        'C10': '255,192,203', // розовый
        'C11': '165,42,42', // коричневый
        'C12': '128,128,128', // серый
        'D13': '0,0,128',   // темно-синий
        'D14': '0,128,128', // бирюзовый
        'D15': '255,127,80', // коралловый
        'E16': '250,128,114', // лососевый
        'E17': '240,230,140', // хаки
        'E18': '255,215,0', // золото
        'F19': '238,130,238', // фиолетовый
        'F20': '75,0,130', // индиго
        'G21': '128,128,0', // оливковый
        'G22': '230,230,250', // лаванда
        'X': '255,105,180', // ярко-розовый
        'Y': '0,191,255' // глубокий небесный синий 
    };


    const drawBoxes = (canvas, imageUrl, boxes) => {
        const context = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = originalShape[1];
            canvas.height = originalShape[0];
            context.drawImage(img, 0, 0);

            for (const classId in boxes) {
                const boxArray = boxes[classId];
                const color = classColors[classId];

                for (const box of boxArray) {
                    const [x1, y1, x2, y2] = box;

                    context.strokeStyle = `rgba(${color}, 1)`;
                    context.lineWidth = 2;
                    context.strokeRect(x1, y1, x2 - x1, y2 - y1);

                    context.fillStyle = `rgba(${color}, 1)`;
                    context.font = '16px Arial';
                    context.fillText(classId, x1, y1 - 5);
                }
            }
        };
        img.src = imageURL;
    };

    const drawFilledBoxes = (canvas, imageUrl, boxes) => {
        const context = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = originalShape[1];
            canvas.height = originalShape[0];
            context.drawImage(img, 0, 0);

            for (const classId in boxes) {
                const boxArray = boxes[classId];
                const color = classColors[classId];

                for (const box of boxArray) {
                    const [x1, y1, x2, y2] = box;

                    context.fillStyle = `rgba(${color}, 0.5)`;
                    context.fillRect(x1, y1, x2 - x1, y2 - y1);

                    context.fillStyle = `rgba(${color}, 1)`;
                    context.font = '16px Arial';
                    context.fillText(classId, x1, y1 - 5);
                }
            }
        };
        img.src = imageURL;
    };

    useEffect(() => {
        const canvas1 = canvasRef1.current;
        const canvas2 = canvasRef2.current;

        if (canvas1 && canvas2 && Object.keys(boxes).length > 0) {
            drawBoxes(canvas1, imageURL, boxes);
            drawFilledBoxes(canvas2, imageURL, boxes);
        }
    }, [imageURL, prediction, originalShape]);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <canvas ref={canvasRef1} style={{ border: '1px solid black' }} />
                <canvas ref={canvasRef2} style={{ border: '1px solid black' }} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {Object.entries(boxes).flatMap(([classID, boxArray]) => 
                    boxArray.map((box, index) => {
                        const [x1, y1, x2, y2] = box;
                        const width = x2 - x1;
                        const height = y2 - y1;

                        return (
                            <>
                            <figcaption>{classID}</figcaption>
                            <div 
                                key={`${classID}-${index}`}
                                style={{
                                    width: width,
                                    height: height,
                                    backgroundImage: `url(${imageURL})`,
                                    backgroundPosition: `-${x1}px -${y1}px`,
                                    backgroundSize: 'initial', 
                                    border: '1px solid rgba(0, 0, 0, 0.5)',
                                }}
                            />
                            </>
                        );
                    })
                )}
            </div>
        </>
    );
};

export default BoxDrawer;