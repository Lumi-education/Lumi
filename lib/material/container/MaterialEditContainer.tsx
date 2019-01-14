// modules
import * as React from 'react';
import { connect } from 'react-redux';

import * as Material from '..';
import * as UI from 'lib/ui';

import {
    default as MaterialEdit,
    IStateProps,
    IDispatchProps as IComponentDispatchProps
} from '../components/MaterialEdit';

interface IPassedProps {}

// interface IStateProps extends IPassedProps {
//     material: Material.types.IMaterial;
// }

interface IDispatchProps extends IComponentDispatchProps {}

interface IProps extends IStateProps, IDispatchProps {}

export class MaterialEditContainer extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        return <MaterialEdit {...this.props} />;
    }
}

function mapStateToProps(state: Material.types.IState, ownProps): IStateProps {
    return {
        material: Material.selectors.material_edit(state)
    };
}

function mapDispatchToProps(dispatch): IDispatchProps {
    return {
        change: (payload: any) => dispatch(Material.actions.change(payload)),
        upload: (material_id: string, file: FormData) =>
            dispatch(Material.actions.upload_h5p(material_id, file)),
        destroy: (material_id: string) => {
            dispatch(Material.actions.destroy(material_id)).then(res => {
                dispatch(UI.actions.push('/admin/material'));
            });
        },
        update: (material: Material.types.IMaterial) => {
            dispatch(Material.actions.update(material));
        }
    };
}

export default connect<IStateProps, IDispatchProps, IPassedProps>(
    mapStateToProps,
    mapDispatchToProps
)(MaterialEditContainer);
