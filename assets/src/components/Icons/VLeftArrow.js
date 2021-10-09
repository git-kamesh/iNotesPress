import { h } from 'preact';

export default function VLeftArrow(props) {
    return (
        <svg viewBox="0 0 15 15" fille="none" xmlns="http://www.w3.org/2000/svg" width={props.size || 22} height={props.size || 22}>
            <path d="M1.5 7.5l4-4m-4 4l4 4m-4-4H14" stroke={ props.color || 'currentColor' }></path>
        </svg>
    );
}