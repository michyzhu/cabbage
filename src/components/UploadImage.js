import React, {Component} from "react"

export default class UploadIMage extends Component {

    contructor(props) {
        super(props)
        this.onFileChange = this.onFileChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            profileImg:""
        }
    }

    onFileChange(e) {
        this.setState({profileImg: e.target.files[0]})
    }

    onSubmit(e) {
        e.preventDefalt()
        const formData = newFormData()
        formData.append("profileImg", this.state.profileImg)
        axios.post("http://something", formdata, {}).then(
            res => {
                console.log(res)
            }
        )
    }

    render() {
        return (
            <div className="container">
                <div>
                    <form onSubmit={this.onSubmit}>
                        <h3>Upload Image Here</h3>
                        <div className="form-group">
                            <input type="file" onChange={this.onFileChange}/>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary" type="submit">
                                Upload
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}