import './mask.scss';

export default function Mask({ isState }) {
    return (
        <div className={`mask ${isState ? 'mask--visible' : ''}`}></div>
    )
}