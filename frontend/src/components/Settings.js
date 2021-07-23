import React from 'react';
import './css/settings.css';

function Settings() {

    const onClickUpdatePref = (e) => {
        e.preventDefault();
        window.location.href="/updatePreferences";
        
    }

    // const changeSettings = () => {

    // }

    return (
        <div className="settings">
            <div className="settings-form">
                <form>
                    <label className="input-label">First Name
                        <input 
                            type="text"
                            placeholder="Change first name..."
                            className="input-field"
                        />
                    </label>
                    <label className="input-label">Last Name
                        <input 
                            type="text"
                            placeholder="Change last name..."
                            className="input-field"
                        />
                    </label>
                    <label className="input-label">Email
                        <input 
                            type="text"
                            placeholder="Change last name..."
                            className="input-field"
                        />
                    </label>
                    <label className="input-label">Username
                        <input 
                            type="text"
                            placeholder="Change last name..."
                            className="input-field"
                        />
                    </label>
                    <label className="input-label">Password
                        <input 
                            type="text"
                            placeholder="Change last name..."
                            className="input-field"
                        />
                    </label>
                    <button className="settings-btn" onClick={onClickUpdatePref}>prefernces</button>
                    <button className="settings-btn">Cancel</button>
                    <button className="settings-btn">Save</button>
                </form>
            </div>
        </div>
    )
}

export default Settings;
