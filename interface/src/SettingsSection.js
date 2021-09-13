import React from "react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


const SettingsSections = ({possibleLanguages, selectedLanguage, onLanguageChanged}) => {
  function onLangChangedLocal(event) {
    onLanguageChanged(event.target.value)
  }

  return (
    <div>
      <Select labelId="language-select-label" value={selectedLanguage} onChange={onLangChangedLocal}>
        {Object.keys(possibleLanguages).map((language) => {
          return <MenuItem key={language} value={language}>{possibleLanguages[language]}</MenuItem>
        })}
      </Select>
    </div>
  )
}

export default SettingsSections;
