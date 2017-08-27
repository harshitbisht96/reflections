/**
 * Created by harshitbisht96 on 18/8/17.
 */
function validateform()
{

    var inputFile=document.getElementById('inputFile');
    var fileName=inputFile.value;
    fileName.toString();
    var format=fileName.slice(-3);
    var another=fileName.slice(-4);
    if(format.toLowerCase()=='jpg' || format.toLowerCase()=='png' )
    {
        return true;
    }
    if(another=='jpeg')
    {
        return true;
    }
    // var count=0;
    // for(var i=0;i<fileName.length;i++)
    // {
    //     if(fileName[i]==".")
    //     {
    //         count++;
    //     }
    // }
    // if(count>=2)
    // {
    //     return false;
    // }



    // alert(inputFile);
    // console.log(avatar);
    alert("Add file of correct format");
    return false;
}
