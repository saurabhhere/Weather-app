import React, { Component } from 'react'
import './Home.css';
import {
    FaCloud,
    FaBolt,
    FaCloudRain,
    FaCloudShowersHeavy,
    FaSnowflake,
    FaSun,
    FaSmog,
} from 'react-icons/fa';
const api_key = process.env.REACT_APP_API_KEY;

class Home extends Component {
    state = {
        loading: true,
        city: '',
        data: '',
        date: '',
        sunrise: '',
        sunset: '',
        temp: '',
    }
    handleChange = (e) => {
        this.setState({
            city: e.target.value
        })
    }

    handleUnixToTime = (num) => {
        let unix_timestamp = num;
        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return formattedTime;
    }

    handleUnixToDate = (num) => {
        var months_arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var day_arr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        var temp = new Date(num * 1000);
        var month = months_arr[temp.getMonth()];
        var date = temp.getDate();
        var day = day_arr[temp.getDay()-1];
        var fulldate = day + ', ' + date + ' ' + month;
        return fulldate;
    }


    handleSubmit = (e) => {
        e.preventDefault();
        let api = `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=${this.state.city}&appid=${api_key}`;
        fetch(api).then(response => {
            if (response.ok){
                return response.json();
            } else {
                throw (response && ((response.response && response.response.data && (response.response.data.message || response.response.data)) || (response.code))) || response;
            }   
        }).catch(function () {
            alert("Something went wrong")
        }).then(data => {
            if (data !== undefined){

    
            if (data.weather[0].main === 'Thunderstorm') {
                this.setState ({
                    icon : <FaBolt />
                })
              } else if (data.weather[0].main === 'Drizzle') {
                this.setState ({
                    icon : <FaCloudRain/>
                })
              } else if (data.weather[0].main === 'Rain') {
                this.setState ({
                    icon : <FaCloudShowersHeavy />
                })
              } else if (data.weather[0].main === 'Snow') {
                this.setState ({
                    icon : <FaSnowflake />
                })
              } else if (data.weather[0].main === 'Clear') {
                this.setState ({
                    icon : <FaSun />
                })
              } else if (data.weather[0].main === 'Clouds') {
                this.setState ({
                    icon : <FaCloud />
                })
              } else {
                this.setState ({
                    icon : <FaSmog />
                })
              }

            this.setState({
                data: data,
                loading: false,
                temp: Math.round(parseFloat(data.main.temp)-273.15),
                date: this.handleUnixToDate(data.dt),
                sunrise: this.handleUnixToTime(data.sys.sunrise),
                sunset: this.handleUnixToTime(data.sys.sunset)
            })}
        });
        this.setState({
            city: ''
        });
    }  

    render() {
        return (
            <div className="hero_section">
                <div className="container">
                    <div className="input-container">
                        <form onSubmit={this.handleSubmit}>
                            <input className="input-city" value={this.state.city} onChange={this.handleChange} placeholder="Enter City" />
                        </form>
                    </div>
                    <div className="output-container">
                        {this.state.loading ? <div></div> :
                            <div className="output">
                                <div className="left">
                                    <div className='location-time'>
                                        <div className="location">{this.state.data.name}, {this.state.data.sys.country}</div>
                                        <div className="time">{this.state.date}</div>
                                    </div>
                                    <div className='logo-temp'>
                                        <div className="icon icon-flex">
                                        {this.state.icon}
                                        </div>
                                        <div className="description-flex">
                                            <div className="output-temp data">{this.state.temp} &deg;C</div>
                                            <div className="icon-description data">{this.state.data.weather[0].description}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="right">
                                    <div className="ele_right">
                                        <div className>Wind Speed</div>
                                        <div>{this.state.data.wind.speed} m/s</div>
                                    </div>
                                    <div className="ele_right">
                                        <div>Humidity</div>
                                        <div>{this.state.data.main.humidity} %</div>
                                    </div>
                                    <div className="ele_right">
                                        <div>Sunrise</div>
                                        <div>{this.state.sunrise}</div>
                                    </div>
                                    <div className="ele_right">
                                        <div>Sunset</div>
                                        <div>{this.state.sunset}</div>
                                    </div>
                                    <div className="ele_right">
                                        <div>Pressure</div>
                                        <div>{this.state.data.main.pressure} hPa </div>
                                    </div>
                                    <div className="ele_right">
                                        <div>Visibility</div>
                                        <div>{this.state.data.visibility} m</div>
                                    </div>
                                </div>
                            <div>{this.state.data.message}</div>
                            </div>
                        }
                    </div>
                </div>

            </div>
        )
    }
}
export default Home