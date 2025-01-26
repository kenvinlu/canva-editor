import { useSelectedLayers } from 'canva-editor/hooks';
import { LayerSettings } from 'canva-editor/utils/settings';

const AppLayerSettings = () => {
    const { selectedLayerIds } = useSelectedLayers();
    return (
        <div
            css={{
                background: 'white',
                borderBottom: '1px solid rgba(57,76,96,.15)',
                height: 50,
                overflow: 'auto',
                flexShrink: 0,
                '@media (max-width: 900px)': {
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: '#fff',
                    display: selectedLayerIds.length > 0 ? 'flex' : 'none',
                    justifyContent: 'center',
                    zIndex: 11,
                    height: 65,
                },
            }}
        >
            <LayerSettings />
        </div>
    );
};

export default AppLayerSettings;
