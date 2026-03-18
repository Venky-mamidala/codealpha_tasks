document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('age-form');
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    
    const dayError = document.getElementById('error-day');
    const monthError = document.getElementById('error-month');
    const yearError = document.getElementById('error-year');
    
    const resultYears = document.getElementById('result-years');
    const resultMonths = document.getElementById('result-months');
    const resultDays = document.getElementById('result-days');

    // Utility function to show error
    const showError = (input, errorEl, message) => {
        input.classList.add('error');
        errorEl.textContent = message;
    };

    // Utility function to clear error
    const clearError = (input, errorEl) => {
        input.classList.remove('error');
        errorEl.textContent = '';
    };

    // Utility function to check if a date is valid (e.g., handles 31st of April, leap years)
    const isValidDate = (day, month, year) => {
        const date = new Date(year, month - 1, day);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    };

    const animateNumber = (element, start, end, duration) => {
        let current = start;
        const range = end - start;
        // If range is 0, just set immediately
        if (range === 0) {
            element.textContent = end;
            return;
        }
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset errors
        clearError(dayInput, dayError);
        clearError(monthInput, monthError);
        clearError(yearInput, yearError);
        resultYears.textContent = '--';
        resultMonths.textContent = '--';
        resultDays.textContent = '--';
        
        let isValid = true;
        const currentData = new Date();
        const currentYear = currentData.getFullYear();
        const currentMonth = currentData.getMonth() + 1;
        const currentDay = currentData.getDate();

        const inputDay = parseInt(dayInput.value);
        const inputMonth = parseInt(monthInput.value);
        const inputYear = parseInt(yearInput.value);

        // Validation: Empty check usually handled by HTML5 'required' attribute, but let's be safe.
        // Validation: Day
        if (isNaN(inputDay) || inputDay < 1 || inputDay > 31) {
            showError(dayInput, dayError, 'Must be a valid day');
            isValid = false;
        }

        // Validation: Month
        if (isNaN(inputMonth) || inputMonth < 1 || inputMonth > 12) {
            showError(monthInput, monthError, 'Must be a valid month');
            isValid = false;
        }

        // Validation: Year
        if (isNaN(inputYear)) {
            showError(yearInput, yearError, 'Must be a valid year');
            isValid = false;
        } else if (inputYear > currentYear) {
            showError(yearInput, yearError, 'Must be in the past');
            isValid = false;
        }

        // If inputs are individually valid, check the combined date
        if (isValid) {
            if (!isValidDate(inputDay, inputMonth, inputYear)) {
                showError(dayInput, dayError, 'Must be a valid date');
                isValid = false;
            } else {
                const birthDate = new Date(inputYear, inputMonth - 1, inputDay);
                if (birthDate > currentData) {
                    showError(yearInput, yearError, 'Date must be in the past');
                    isValid = false;
                }
            }
        }

        // Calculate Age if valid
        if (isValid) {
            let birthDay = inputDay;
            let birthMonth = inputMonth;
            let birthYear = inputYear;

            let ageYears = currentYear - birthYear;
            let ageMonths = currentMonth - birthMonth;
            let ageDays = currentDay - birthDay;

            if (ageDays < 0) {
                ageMonths -= 1;
                // Get the number of days in the previous month
                const previousMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate();
                ageDays += previousMonthLastDay;
            }

            if (ageMonths < 0) {
                ageYears -= 1;
                ageMonths += 12;
            }

            // Animate results
            animateNumber(resultYears, 0, ageYears, 1000);
            animateNumber(resultMonths, 0, ageMonths, 1000);
            animateNumber(resultDays, 0, ageDays, 1000);
        }
    });

    // Clear errors on input change and auto-focus next input
    const handleInput = (input, errorEl, nextInput, maxLength) => {
        input.addEventListener('input', () => {
            clearError(input, errorEl);
            if (nextInput && input.value.length === maxLength) {
                nextInput.focus();
            }
        });
    };
    handleInput(dayInput, dayError, monthInput, 2);
    handleInput(monthInput, monthError, yearInput, 2);
    handleInput(yearInput, yearError, null, 4);
});
