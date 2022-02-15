
export const BatchStatus = ['Manufactured', 'Deliver National', 'Stored National', 'Deliver Regional', 'Stored Regional', 'Deliver Hub', 'Stored Hub', 'Used']
export const ActorRoles = [ 'Manufacturer', 'Courier', 'National Facilities', 'Regional Facilities', 'Vax Hub','Admin' ]


export function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

export function zip (a, b) {
     a.map((k, i) => [k, b[i]]) 
};

export const errorMessage = `An error has occured while connecting to the blockchain.\nMaybe you have not the permission to load this page.\nCheck console for details.`;
export const notFoundMessage = 'The item you are looking for is not stored on the chain.\nRe-try with another search query.'
export const updateErrorMessage = 'The update status request has failed. \nRe-try with another search query.'
export const addErrorMessage = 'The add request (vaccine batch or actor) has failed. \nRe-try with another search query.'
