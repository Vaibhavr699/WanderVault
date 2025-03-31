import Add_Story_Img from '../assets/images/add-story.svg';
import No_Filter_Img from '../assets/images/no-filter.svg';
import No_Search_Img from '../assets/images/no-search.svg';



export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }
    return initials.toUpperCase();
};

export const getEmptyCardMessage = (filterType) =>{
    switch(filterType){
        case "search":
            return `Oops! No stories found matching your Search.`;

        case "date":
            return `No stories found in the given date range`;

        default:
            return`Start Creating your stories!! beyotchhhhh!`;        
    }
};

export const getEmptyCardImg = (filterType) =>{
    switch(filterType){
        case "search":
            return No_Search_Img;

        case "date":
            return No_Filter_Img;

        default:
            return Add_Story_Img;        
    }
};
