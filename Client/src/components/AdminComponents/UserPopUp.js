import React from 'react';
import Popup from 'reactjs-popup';

function UserPopUp() {
    return (
        <div
            style={{ height: 200, width: 400, border: '1px solid red' }}
            className="tooltipBoundary"
        >
            <Popup
                trigger={
                    <button type="button" className="button">
                        Trigger 1
                    </button>
                }
                position={['top center', 'bottom right', 'bottom left']}
                closeOnDocumentClick
                keepTooltipInside=".tooltipBoundary"
            >
                Tooltip content
            </Popup>
        </div>
    );
}

export default UserPopUp;
