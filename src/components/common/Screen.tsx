import React, {RefObject} from 'react';
import './css/Screen.css'

interface ScreenProps {
    overlay: JSX.Element | null
    content: JSX.Element
    parallax: JSX.Element
    className: string | undefined
    link?: RefObject<HTMLDivElement> | undefined
}

function Screen(props: ScreenProps) {
    let overlay = null;
    if (props.overlay) {
        overlay = <div className='screen-overlay'>
            { props.overlay }
        </div>
    }

    const className = 'screen-container';

    return (
        <div className={ `screen ${ props.className }` }>
            <div className='screen-parallax'>
                { props.parallax }
            </div>
            <div ref={props.link} className={className}>
                { props.content }
            </div>
            { overlay }
        </div>
    );
}

export default Screen;