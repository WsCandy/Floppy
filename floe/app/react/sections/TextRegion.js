import Options from '../ui/Options';

class TextRegion extends React.Component {

    constructor() {
        super();
        this.state = {
            defaults: {
                content: 'this is some sample text',
                align: 'left'
            }
        }
    };

    removeElement(id) {
        this.props.remove(id);
    };

    updateState(e) {
        console.log(e);
        this.setState({
            defaults: {
                content: e.content,
                align: e.align
            }
        })
    };

    render() {
        return (
            <div className="row">
                <div className="large-12 columns">
                    <div className="block" style={{position: "relative"}}>
                        <p style={{textAlign: this.state.defaults.align}}>{this.state.defaults.content}</p>
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
}

export default TextRegion;