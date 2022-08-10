import ImageService from "api/image.service";
import SettingService from "api/gateway-setting.service";


async function AutoCheck() {
    var patientinfoclient = [];
    var patientinfocloud = [];
    const patient_id = '*';
    const study_date = '*';  
    const pacsclient = {ip_addr: '192.168.100.248', port: 6002, ae_title: 'pacsclient'};
    const pacscloud = {ip_addr: '192.168.100.231', port: 6002, ae_title: 'test'};
    var missing = {};
    var mailcontent = {};
    var checkstatus = '';
    var templateParams = {};
    
    const patientinfo_client = await ImageService.findImageonPACSClient(patient_id, pacsclient, study_date)
            .then( response => {
                patientinfoclient = response.data.patient

                })
            .catch(error => {
                console.error("ERROR: Could not get patient infor");
                patientinfoclient = [];
                });

    const patientinfo_cloud = await ImageService.findImageonPACSCloud(patient_id, pacscloud, study_date)
            .then( response => {
                patientinfocloud = response.data.patient;

                })
            .catch(error => {
                console.error("ERROR: Could not get patient infor");
                patientinfocloud = [];               
                });

    
    const compare = patientinfoclient.length - patientinfocloud.length;
    if (compare > 0) {
        checkstatus = '<style> h5 { color: red; font-size: 22px; font-weight: bold; } </style> <h5> MISSING ON CLOUD: '+ compare +'</h5>';
        missing = patientinfoclient.filter(({ study_instanceuid: id1 }) => !patientinfocloud.some(({ study_instanceuid: id2 }) => id2 === id1));

        // let missingdata = missing.map((x, i) => {
        //                   x = Object.assign({id: i + 1}, x);
        //                   delete x.patient_name;
        //                   delete x.image_count;
        //                   delete x.study_date;
        //                   delete x.modalities;                        
        //                   return x
        //                 });
        // mailcontent = {data: missingdata, status: checkstatus};
        // mailcontent.config = {
        //   rightAlign: [],
        //   hasFooter: false,
        //   columnOffset: 5
        // };
        let missingdata = '<style> table, th, td { border:1px solid black; text-align: center; font-size:12px; padding: 2px; } </style> <table style="width:100%"> <tr> <th> ID   </th> <th>Patient_id</th> <th>Study_instanceuid</th> </tr>'
        for (var i = 0; i < missing.length; i++) {
            missingdata += '<tr> <th>' + [i+1]  + '</th> <th> '+ missing[i].patient_id + '</th><th>' + missing[i].study_instanceuid + '</th> </tr>'
        }
        missingdata += '</table>';
        mailcontent = { status: checkstatus, data: missingdata};

    }
    
    else if (compare < 0) {
        checkstatus = '<style> h5 { color: red; font-size: 18px; font-weight: bold; } </style> <h5> MISSING ON CLIENT: '+ compare +'</h5>';
        let compare2 = compare * -1;
        missing = patientinfocloud.filter(({ study_instanceuid: id1 }) => !patientinfoclient.some(({ study_instanceuid: id2 }) => id2 === id1));
        let missingdata = '<style> table, th, td { border:1px solid black; text-align: center; font-size:12px; padding: 2px; } </style> < style="width:100%"> <tr> <th> ID   </th> <th>Patient_id</th> <th>Study_instanceuid</th> </tr>'
        for (var i = 0; i < missing.length; i++) {
            missingdata += '<tr>'+ [i+1] +'. study_instanceuid: '+ missing[i].study_instanceuid + ', ' + 'patient_id: ' + missing[i].patient_id + '</tr>';
            missingdata += '<tr> <th>' + [i+1]  + '</th> <th> '+ missing[i].patient_id + '</th><th>' + missing[i].study_instanceuid + '</th> </tr>'
        }
        missingdata += '</table>';
        mailcontent = { status: checkstatus, data: missingdata};
    }
    else {
        checkstatus = '<style> h5 { color: green; font-size: 18px; font-weight: bold; } </style> <h5> OK </h5>';
        let missingdata = '<style> p {  font-size: 12px; } </style> <p> Up to date! </p>';
        mailcontent = { status: checkstatus, data: missingdata};       
    }
    
    // makeTable(mailcontent).then(response => {templateParams.mailcontent=response.text});
  
    return templateParams = mailcontent;


};
export {AutoCheck};



// async function makeTable(mailcontent) {

//     var i = 0;
//     var k;
//     var tableData = {
//       LineLength: 0,
//       columns: [],
//       columnLength: [],
//       text: ""
//     };
  
//     //Store the column headers and init with cell size
//     for (i = 0; i < Object.keys(mailcontent.data[0]).length; i++) {
//       tableData.columns.push([Object.keys(mailcontent.data[0])[i].toString()]);
//       tableData.columnLength.push(Object.keys(mailcontent.data[0])[i].length);
//     }
  
//     //Build column data and find largest cell in each column
//     mailcontent.data.forEach(function(row) {
//       var j = 0;
//       for (const [key, value] of Object.entries(row)) {
//         tableData.columns[j].push(value.toString());
//         value.length > tableData.columnLength[j] &&
//           (tableData.columnLength[j] = value.length);
//         j++;
//       }
//     });
  
//     //Find line length
//     tableData.LineLength = tableData.columnLength.reduce(function(a, c) {
//       return a + c;
//     }, tableData.columnLength.length * mailcontent.config.columnOffset);
  
//     //Generate top border
//     tableData.text +=
//       tableData.columnLength.reduce(function(a, c) {
//         var ret = "";
//         for (i = 0; i < c + mailcontent.config.columnOffset; i++) {
//           ret += "-";
//         }
//         ret += "+";
//         return a + ret;
//       }, "+") + "\n";
  
//     //Generate Headers
//     tableData.text +=
//       tableData.columns.reduce(function(a, c, j) {
//         var ret = c[0];
//         for (
//           i = c[0].length;
//           i < tableData.columnLength[j] + mailcontent.config.columnOffset;
//           i++
//         ) {
//           ret += " ";
//         }
//         ret += "|";
//         return a + ret;
//       }, "|") + "\n";
  
//     //Generate header border
//     tableData.text +=
//       tableData.columnLength.reduce(function(a, c) {
//         var ret = "";
//         for (i = 0; i < c + mailcontent.config.columnOffset; i++) {
//           ret += "=";
//         }
//         ret += "+";
//         return a + ret;
//       }, "+") + "\n";
  
//     //Generate rest of the rows
//     //-- Determine iteration length
//     var iL = mailcontent.config.hasFooter
//       ? tableData.columns[0].length - 1
//       : tableData.columns[0].length;
//     for (k = 1; k < iL; k++) {
//       tableData.text +=
//         tableData.columns.reduce(function(a, c, j) {
//           var ret = "";
//           if (mailcontent.config.rightAlign.indexOf(c[0]) < 0) {
//             ret = c[k];
//           }
//           for (
//             i = c[k].length;
//             i < tableData.columnLength[j] + mailcontent.config.columnOffset;
//             i++
//           ) {
//             ret += " ";
//           }
//           if (mailcontent.config.rightAlign.indexOf(c[0]) > -1) {
//             ret += c[k];
//           }
//           ret += "|";
//           return a + ret;
//         }, "|") + "\n";
//     }
  
//     //If table has footer
//     if (mailcontent.config.hasFooter) {
//       //Generate footer border
//       tableData.text += tableData.columnLength.reduce(function(a, c) {
//         var ret = "";
//         for (i = 0; i < c + mailcontent.config.columnOffset; i++) {
//           ret += "=";
//         }
//         ret += "+";
//         return a + ret;
//       }, "+");
//       tableData.text += "\n";
  
//       //Generate Footer
//       tableData.text +=
//         tableData.columns.reduce(function(a, c, j) {
//           var ret = "";
//           if (mailcontent.config.rightAlign.indexOf(c[0]) < 0) {
//             ret = c[tableData.columns[0].length - 1];
//           }
  
//           for (
//             i = c[tableData.columns[0].length - 1].length;
//             i < tableData.columnLength[j] + mailcontent.config.columnOffset;
//             i++
//           ) {
//             ret += " ";
//           }
//           if (mailcontent.config.rightAlign.indexOf(c[0]) > -1) {
//             ret += c[tableData.columns[0].length - 1];
//           }
//           ret += "|";
//           return a + ret;
//         }, "|") + "\n";
//     }
//     //Generate bottom border
//     tableData.text +=
//       tableData.columnLength.reduce(function(a, c) {
//         var ret = "";
//         for (i = 0; i < c + mailcontent.config.columnOffset; i++) {
//           ret += "-";
//         }
//         ret += "+";
//         return a + ret;
//       }, "+") + "\n";
    
//     return tableData;
// }

