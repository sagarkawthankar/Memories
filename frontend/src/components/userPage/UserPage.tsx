import './UserPage.css';
import React from "react";
import {Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Redirect} from "react-router";
import Table from "../table/Table";

export default class UserPage extends React.Component {

    state = {
        check: false,
        title: "",
        description: "",
        UploadResponse: false,
        redirect: false,
        logout: false,
        rows: [],
        search: ""
    };

    constructor(props: Readonly<{}>) {
        super(props);
        this.createMemories = this.createMemories.bind(this);
        this.loadTitle = this.loadTitle.bind(this);
        this.loadContent = this.loadContent.bind(this);
        this.loadSearch = this.loadSearch.bind(this);
        this.submitData = this.submitData.bind(this);
        this.logout = this.logout.bind(this);
        this.loadTable = this.loadTable.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.loadTable();
    }

    logout() :any {
        this.setState({logout: true});
    }

    createMemories() : any {
        this.setState({check: true});
    }

    generateElements() : any {
        if (this.state.check) {
            return <div className="upload">
                <input type="text" placeholder="Title" className="input" onChange={this.loadTitle} required/>
                <br/>
                <textarea placeholder="Content" className="input" rows={5} onChange={this.loadContent} required/>
                <br/>
                <Button variant="primary" className="mr2" onClick={this.submitData}>Submit</Button>
            </div>;
        }
    }

    loadTitle(event: any) {
        this.setState({title: event.target.value});
    }

    loadContent(event: any) {
        this.setState({description: event.target.value});
    }

    loadSearch(event: any) {
        this.setState({search: event.target.value});
    }

    submitData() {
        if (this.state.title==="" || this.state.description==="") {
            let message = "Error! \n";
            if (this.state.title==="") {
                message += "Enter title \n";
            }
            if (this.state.description==="") {
                message += "Enter description \n";
            }
            alert(message);
        }
        else {
            this.uploadCall().then(
                () => {
                    if (this.state.UploadResponse) {
                        this.setState({UploadResponse: false})
                        alert("Successfully uploaded the memory!");
                        window.location.reload(true);
                    }
                    else {
                        this.setState({redirect: true});
                    }
                }
            );
        }
    }

    search() {
        if (this.state.search==="") {
            let message = "Error! \n";
            message += "Enter search parameter \n";
            alert(message);
        }
        else {
            this.searchCall();
        }
    }

    async searchCall() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Token': localStorage.getItem("Token") as string},
        };
         return fetch('http://localhost:8080/search?userID='+localStorage.getItem("UserID") as string+"&title="+this.state.search, requestOptions)
            .then(response => response.json())
            .then(data => this.setState({rows: data}));
    }

    async uploadCall() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Token': localStorage.getItem("Token") as string},
            body: JSON.stringify({
                userID: localStorage.getItem("UserID"),
                title: this.state.title,
                description: this.state.description})
        };
        return fetch('http://localhost:8080/upload', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({UploadResponse: data}));
    }

    async loadTable() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Token': localStorage.getItem("Token") as string},
        };
        console.log('http://localhost:8080/retrieve?userID='+localStorage.getItem("UserID") as string);
        fetch('http://localhost:8080/retrieve?userID='+localStorage.getItem("UserID") as string, requestOptions)
            .then(response => response.json())
            .then(data => this.setState({rows: data}));
    }

    table() {
        if (this.state.rows.length > 0) {
            const columns = [
                {
                    Header: "Title",
                    accessor: "title"
                },
                {
                    Header: "Content",
                    accessor: "description"
                },
                {
                    Header: "Date Created",
                    accessor: "date"
                }
            ];
            return <Table columns={columns} data={this.state.rows}/>;
        }
    }

    render() {
        if ((localStorage.getItem('UserID') == null || localStorage.getItem('Token') == null)) {
            localStorage.removeItem('UserID');
            localStorage.removeItem('Token');
            alert("Error!\nYou are not allowed to visit this page! Please re-login!");
            return <Redirect to='/'/>;
        }
        else if (this.state.redirect) {
            localStorage.removeItem('UserID');
            localStorage.removeItem('Token');
            alert("Error!\nSomething went wrong! Please re-login!");
            return <Redirect to='/'/>;
        }
        else if (this.state.logout) {
            localStorage.removeItem('UserID');
            localStorage.removeItem('Token');
            return <Redirect to='/'/>;
        }
        else {
            return (
                <div className="App">
                    <div className="App-header">
                        <Button variant="primary" className="logout" onClick={this.logout}>Logout</Button>
                        <Button variant="primary" className="mr2" onClick={this.createMemories}>Create Memory</Button>
                        {this.generateElements()}
                        <br/>
                        <div className="searchDiv">
                            <input type="text" placeholder="" className="search" onChange={this.loadSearch} required/>
                            <Button variant="primary" className="searchButton" onClick={this.search}>Search</Button>
                        </div>
                        {this.table()}
                    </div>
                </div>
            );
        }
    }
}

