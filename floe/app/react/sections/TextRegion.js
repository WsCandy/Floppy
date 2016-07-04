import Options from '../ui/Options';

class TextRegion extends React.Component {

    constructor() {
        super();
        this.state = {
            defaults: {
                content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
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
            <div style={{position: 'relative'}}>
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style={{paddingTop: '5px', paddingBottom: '5px'}}>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="left" className="mq-text-center"
                                        style={{paddingRight: '10px', paddingLeft: '10px'}}>
                                        <div className="text  js-text" style={{textAlign: this.state.defaults.align}}>
                                            {this.state.defaults.content}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <Options remove={this.removeElement.bind(this)}
                             id={this.props.id}
                             defaults={this.state.defaults}
                             update={this.updateState.bind(this)}
                    />
                </table>
            </div>
        )
    }
}

export default TextRegion;