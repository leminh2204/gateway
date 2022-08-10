import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';


function SelectDate(props) {
    const [date,setDate] = useState(moment(new Date()).format('YYYYMMDD'));
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState('');
    const [displayDate, setDisplayDate] = useState('Choose days');

    useEffect(() => {
         props.selectdate(date) }, [date]);


    const TodaySelection = () => {
        setDate(moment(new Date()).format('YYYYMMDD'));

    }
    
    const YesterdaySelection = () => {
        // setDate(moment(new Date()).subtract(1, 'days').format('YYYYMMDD'));
        setDate('Yesterday')  
    }
    const LastWeekSelection = () => {
        setDate(moment(new Date()).subtract(7, 'days').format('YYYYMMDD'));
    }
    const AllSelection = () => {
        setDate('*');
    }
    const handleChange = (e) => {
        setValue(e.target.value);
        switch(e.target.value){
            case 'Today': TodaySelection();setDisplayDate('Choose days'); setIsOpen(false); break;
            case 'Yesterday': YesterdaySelection();setDisplayDate('Choose days'); setIsOpen(false); break;
            case 'Last week': LastWeekSelection(); setDisplayDate('Choose days'); setIsOpen(false); break;
            case 'All': AllSelection(); setDisplayDate('Choose days'); setIsOpen(false); break;
            case 'Choose days': setIsOpen(true); break;
        }
    };
    const ChangeDate = (dates) => {
        const [start, end] = dates; 
        setStartDate(start)
        setEndDate(end)
        if (start !==null && end !==null) {
            setIsOpen(false);
            setDisplayDate(moment(start).format('DD/MM/YYYY') + '-' + moment(end).format('DD/MM/YYYY'));
        }
        if(start !== null && start !== '' && end !== null && end !== '' ){
        setDate(moment(start).format('YYYYMMDD') + '-' + moment(end).format('YYYYMMDD'));
        }
      };
    
    return (
        <div>
            <div>
                <span>Time: </span>  
                <select value={value} onChange={handleChange} >
                    <option defaultValue value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                    <option value="Last week">Last week</option>
                    <option value="Choose days">{displayDate}</option>
                    <option value="All">All</option>
                </select>
                {isOpen ? <DatePicker 
                                selected={startDate}
                                onChange={ChangeDate}
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="yyyy-MM-dd"
                                selectsRange={true}
                                showMonthDropdown
                                showYearDropdown
                                scrollableMonthYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={15}
                                inline
                            /> :null }
            </div>
        </div>
    )
}
export {SelectDate};
