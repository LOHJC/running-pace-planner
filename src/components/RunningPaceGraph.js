import React from 'react'
import { Grid, Typography } from '@mui/material'
//import { Typography } from '@mui/material'
import { AveragePace, FormatPace, RunLinearly } from '../RunningMathFunctions'
//import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList} from 'recharts';
import { useTheme } from '@mui/material/styles';

export const RunningPaceGraph = (props) => {

    let data_array = RunLinearly(props.distance,props.timeHour,props.timeMin,props.gradientScale);
    let average_pace = AveragePace(props.distance,props.timeHour,props.timeMin);
    let dataset=[];
    let fulldataset = [];
    const theme = useTheme();
    data_array.map((data)=>(
        //based on the dataset amount see if it changes to another set
        dataset.push({
            "km": data.dist_km,
            "time": data.time_min + (data.time_sec/60)
        })
    ))

    let valueFormatter = (value) => `${value}km`;

    const chartSetting = {
        yAxis: [
          {
            label: "Time (min)",
          },
        ],
        width: 600,
        height: 500,
    };
    
    //Rearrange the data
    if (data_array.length)
    {
        let data_per_chart = 12; 
        let no_of_chart = Math.ceil(data_array.length/data_per_chart);
        let remainder = data_array.length%data_per_chart;
        fulldataset = []; //initialization
        for (let i=0; i<no_of_chart; i++)
        {  
            //console.log("no_of_chart:"+no_of_chart.toString());
            let new_dataset = [];
            if (i===no_of_chart-1 && remainder !== 0)
            {
                new_dataset = dataset.slice((i*data_per_chart), (i*data_per_chart)+i+remainder+1);
            }
            else
            {
                new_dataset = dataset.slice((i*data_per_chart)+i,(i+1)*data_per_chart);
            }
            fulldataset.push({"id": i, "dataset":new_dataset});
        }
        //console.log(data_array);
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" >
                <div className="label">{`KM ${label}`}</div>
                <div className="time">{`Pace: ${FormatPace(payload[0].value)}`}</div>
                </div>
            );
        }
      
        return null;
      };
    
    function defineYRangeMax(data)
    {
        let max_time = -1;
        data.forEach((d)=>{
            if (d.time > max_time)
                max_time=d.time;
        })
        return Math.ceil(max_time);
    }

    function showAveragePace()
    {
        if (average_pace!="")
            return <Typography>Average Pace: {average_pace}</Typography>
        else
            return <Typography></Typography>
    }

    function showChart(data,key)
    {
        if (data.length)
        {
            //console.log(theme.palette.primary);
            return (
                <ResponsiveContainer key={key} width="100%" aspect="1">
                    <BarChart data={data} margin={{top:10, left: 10, right:10, bottom: 10}}>
                        <XAxis label={{ value: 'Distance (km)', position: 'insideBottom', dy:10}} dataKey="km" />
                        <YAxis domain={[0,defineYRangeMax(data)]} label={{ value: 'Pace', angle: -90, position: 'insideLeft', dx:10}}/>
                        <Tooltip content={<CustomTooltip />} wrapperStyle={{background:"white", padding: "1%", border:`1px solid ${theme.palette.primary.light}`, borderRadius:5}}/>
                        {/* <Tooltip /> */}
                        <Legend verticalAlign="top" formatter={(value, entry, index) => {
                            return <span style={{ color: "black" }}>{value}</span>;
                            }} />
                        {/* <Legend /> */}
                        <Bar dataKey="time" fill={theme.palette.primary.main}>
                            <LabelList dataKey="time" position="top" angle="45" formatter={(value)=>{
                                return FormatPace(value);
                            }}/>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                
            )
        }
    }

    return (
        // <Grid item xs={props.xs}>
        //     {
        //         fulldataset.map((data)=>(

        //             <BarChart key={data.id} dataset={data.dataset} 
        //                 xAxis={[{ scaleType: "band", dataKey: "km" , categoryGapRatio: 0.2, valueFormatter}]}
        //                 series={[
        //                     {dataKey: "time", label: "min/km"}
        //                     ]}
        //                     {...chartSetting}/>
                            
        //             // <Typography key={data.id} variant="body1" align="center">{data.dist_km}km,{data.time_min}'{data.time_sec}"</Typography> 
        //         ))
        //     }
        // </Grid>

        <Grid item xs={props.xs} sm={props.sm} md={props.md} lg={props.lg} xl={props.xs.xl}>
            {showAveragePace()}
            {fulldataset.map((data)=>(
                showChart(data.dataset,data.id)
            ))}
        </Grid>
    )


    
}
