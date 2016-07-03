import Options from '../ui/Options';

class ButtonRegion extends React.Component {
    constructor() {
        super();
        this.state = {
            defaults: {
            
            }
        }
    };

    removeElement(id) {
        this.props.remove(id);
    };

    changeWidth(e) {
        this.setState({
            width: e.target.value
        });
    };

    updateState(e) {
        this.setState({
            defaults: {

            }
        })
    };

    render() {
        return (
            <div className="row">
                <div className="large-12 columns">
                    <div className="block" style={{position: "relative"}}>
                        <button className="btn  btn--ghost">Button</button>
                        <Options remove={this.removeElement.bind(this)}
                                 id={this.props.id}
                                 defaults={this.state.defaults}
                                 update={this.updateState.bind(this)}
                        />
                    </div>
                </div>
            </div>
        )
    }
};

export default ButtonRegion;