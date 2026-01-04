interface Props {
    zIndex: number;
    top?: number;
    left: number;
    color: string;
}

export const Pointer = ({ zIndex, color, left, top = 0.5 }: Props) => {
    const style = {
        top: `${top * 100}%`,
        left: `${left * 100}%`,
    };

    return (
        <div
            css={{
                position: 'absolute',
                width: 14,
                height: 14,
                transform: 'translate(-50%,-50%)',
                background: '#fff',
                border: '3px solid #fff',
                borderRadius: '50%',
                boxShadow: '0 2px 5px rgba(57,76,96,.15), 0 0 0 1px rgba(64,87,109,.07)',
                zIndex,
            }}
            style={style}
        >
            <div
                css={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    borderRadius: 'inherit',
                }}
                style={{ backgroundColor: color }}
            />
        </div>
    );
};
