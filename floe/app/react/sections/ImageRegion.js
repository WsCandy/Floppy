import Options from '../ui/Options';

class ImageRegion extends React.Component {

    constructor() {
        super();
        this.state = {
            defaults: {
                url: '/assets/img/head-logo.png',
                width: '80',
                height: '148'
            }
        }
    };

    removeElement(id) {
        this.props.remove(id);
    };

    updateState(e) {
        this.setState({
            defaults: {
                url: e.url,
                width: e.width,
                height: e.height
            }
        })
    };

    render() {
        return (
            <div style={{position: 'relative'}}>
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td bgcolor="#2e373e"
                            style={{paddingTop: '20px', paddingBottom: '20px', backgroundColor: '#2e373e'}}>
                            <table width="80" align="center" border="0" cellpadding="0" cellspacing="0"
                                   style={{margin: '0 auto'}}>
                                <tr>
                                    <td>
                                        <a className="js-link">
                                            <img src={this.state.defaults.url}
                                                 style={{width: this.state.defaults.width, height: this.state.defaults.height}}
                                                 border="0"/>
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <Options remove={this.removeElement.bind(this)}
                         id={this.props.id}
                         defaults={this.state.defaults}
                         update={this.updateState.bind(this)}
                />
            </div>
        )
    }
}

export default ImageRegion;