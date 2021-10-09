import { h } from 'preact';

export default function AddIcon(props) {
    return (
        <svg viewBox="0 0 15 15" fille="none" xmlns="http://www.w3.org/2000/svg" width={props.size || 22} height={props.size || 22}>
            <path d="M7.5 4v7M4 7.5h7" stroke={ props.color || 'currentColor' }></path>
        </svg>
    );
}