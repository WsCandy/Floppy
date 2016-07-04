import Options from '../ui/Options';

class ButtonRegion extends React.Component {
    constructor() {
        super();
        this.state = {
            defaults: {}
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
            defaults: {}
        })
    };

    render() {
        return (
            <div style={{position: 'relative'}}>
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style={{paddingRight: '10px', paddingLeft: '10px'}}>
                            <table width="285" align="center" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" bgcolor="#82abb3" className="js-background"
                                        style={{padding: '10px'}}>
                                        <div className="text  text--button  js-text">
                                            <button className="btn  btn--ghost  btn--mailer">Button</button>
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

export default ButtonRegion;