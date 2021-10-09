import './Loading.scss';
import { h } from 'preact';

export default function Loading(props) {
    return (
        <div class={'df_load' + (props.white? ' white' : '') }></div>
    );
}