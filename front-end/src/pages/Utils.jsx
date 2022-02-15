

export const BatchStatus = ['Manufactured', 'Deliver National', 'Stored National', 'Deliver Regional', 'Stored Regional', 'Deliver Hub', 'Stored Hub', 'Used']
export const ActorRoles = [ 'Manufacturer', 'Courier', 'National Facilities', 'Regional Facilities', 'Vax Hub','Admin' ]


export function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

export function zip (a, b) {
     a.map((k, i) => [k, b[i]]) 
};

