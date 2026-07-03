
    (function() {
      // ----- data -----
      let students = [
        { id: 1, name: 'Emma Chen', subject: 'Mathematics', present: true },
        { id: 2, name: 'Liam Park', subject: 'Science', present: false },
        { id: 3, name: 'Sophia Rivera', subject: 'English', present: true },
        { id: 4, name: 'Noah Kim', subject: 'History', present: false },
        { id: 5, name: 'Olivia Smith', subject: 'Art', present: true }
      ];
      let nextId = 6;

      // DOM refs
      const tbody = document.getElementById('studentBody');
      const studentCount = document.getElementById('studentCount');
      const attendanceInfo = document.getElementById('attendanceInfo');
      const dateInfo = document.getElementById('dateInfo');
      const currentDate = document.getElementById('currentDate');
      const toast = document.getElementById('toast');
      const selectAllCheckbox = document.getElementById('selectAllCheckbox');

      let toastTimer = null;

      // helpers
      function showToast(msg) {
        if (toastTimer) { clearTimeout(toastTimer); toast.classList.remove('show'); }
        void toast.offsetWidth;
        toast.textContent = msg || '✨ done';
        toast.classList.add('show');
        toastTimer = setTimeout(() => { toast.classList.remove('show'); toastTimer = null; }, 2000);
      }

      function updateStats() {
        const total = students.length;
        const present = students.filter(s => s.present).length;
        studentCount.textContent = `${total} students`;
        attendanceInfo.textContent = `Present: ${present} / ${total}`;
        // update select all checkbox state
        if (total > 0) {
          const checked = document.querySelectorAll('#studentBody tr .row-checkbox:checked').length;
          selectAllCheckbox.checked = (checked === total);
          selectAllCheckbox.indeterminate = (checked > 0 && checked < total);
        } else {
          selectAllCheckbox.checked = false;
          selectAllCheckbox.indeterminate = false;
        }
      }

      function renderTable() {
        let html = '';
        students.forEach((s, index) => {
          const statusClass = s.present ? 'present' : 'absent';
          const statusText = s.present ? 'Present' : 'Absent';
          html += `
            <tr data-id="${s.id}">
              <td><input type="checkbox" class="row-checkbox" data-id="${s.id}" /></td>
              <td>${index + 1}</td>
              <td><strong>${s.name}</strong></td>
              <td>${s.subject || '—'}</td>
              <td><span class="status-badge ${statusClass}">${statusText}</span></td>
              <td>
                <div class="action-btns">
                  <button class="small-btn success toggle-btn" data-id="${s.id}">🔄 Toggle</button>
                  <button class="small-btn danger remove-btn" data-id="${s.id}">✕</button>
                </div>
              </td>
            </tr>
          `;
        });
        tbody.innerHTML = html;
        updateStats();
      }

      // ----- CRUD operations -----
      function addStudent(name, subject) {
        if (!name.trim()) {
          showToast('⚠️ Please enter a name');
          return false;
        }
        const existing = students.find(s => s.name.toLowerCase() === name.trim().toLowerCase());
        if (existing) {
          showToast(`⚠️ "${name.trim()}" already exists`);
          return false;
        }
        students.push({
          id: nextId++,
          name: name.trim(),
          subject: subject.trim() || '—',
          present: false
        });
        renderTable();
        showToast(`✅ Added "${name.trim()}"`);
        return true;
      }

      function removeStudent(id) {
        const student = students.find(s => s.id === id);
        if (!student) return;
        students = students.filter(s => s.id !== id);
        renderTable();
        showToast(`🗑️ Removed "${student.name}"`);
      }

      function removeSelectedStudents() {
        const checkboxes = document.querySelectorAll('.row-checkbox:checked');
        if (checkboxes.length === 0) {
          showToast('⚠️ Select at least one student');
          return;
        }
        const ids = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
        const names = students.filter(s => ids.includes(s.id)).map(s => s.name);
        students = students.filter(s => !ids.includes(s.id));
        renderTable();
        showToast(`🗑️ Removed ${names.length} student(s): ${names.join(', ')}`);
      }

      function toggleStudent(id) {
        const student = students.find(s => s.id === id);
        if (!student) return;
        student.present = !student.present;
        renderTable();
        showToast(`🔄 ${student.name} → ${student.present ? 'Present' : 'Absent'}`);
      }

      function markAllPresent() {
        students.forEach(s => s.present = true);
        renderTable();
        showToast('✅ All marked present');
      }

      function markAllAbsent() {
        students.forEach(s => s.present = false);
        renderTable();
        showToast('❌ All marked absent');
      }

      function resetDefault() {
        const defaultStates = [true, false, true, false, true];
        students.forEach((s, i) => {
          if (i < defaultStates.length) s.present = defaultStates[i];
          else s.present = false;
        });
        renderTable();
        showToast('↺ Reset to default');
      }

      // ----- date display -----
      function updateDate() {
        const now = new Date();
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const dateStr = now.toLocaleDateString('en-US', options);
        currentDate.textContent = `📅 ${dateStr}`;
        dateInfo.textContent = `📆 Attendance for ${dateStr}`;
      }

      // ----- event binding -----
      document.getElementById('addStudentBtn').addEventListener('click', function() {
        const nameInput = document.getElementById('studentNameInput');
        const subjectInput = document.getElementById('studentSubjectInput');
        addStudent(nameInput.value, subjectInput.value);
        nameInput.value = '';
        subjectInput.value = '';
        nameInput.focus();
      });

      document.getElementById('removeSelectedBtn').addEventListener('click', removeSelectedStudents);

      document.getElementById('markPresentAll').addEventListener('click', markAllPresent);
      document.getElementById('markAbsentAll').addEventListener('click', markAllAbsent);
      document.getElementById('resetDefault').addEventListener('click', resetDefault);

      // select all checkbox
      selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(cb => cb.checked = this.checked);
      });

      // event delegation for row buttons
      tbody.addEventListener('click', function(e) {
        const target = e.target;
        if (target.classList.contains('toggle-btn')) {
          const id = parseInt(target.dataset.id);
          toggleStudent(id);
        } else if (target.classList.contains('remove-btn')) {
          const id = parseInt(target.dataset.id);
          removeStudent(id);
        } else if (target.classList.contains('row-checkbox')) {
          // update select all state
          const checked = document.querySelectorAll('.row-checkbox:checked').length;
          const total = document.querySelectorAll('.row-checkbox').length;
          if (total > 0) {
            selectAllCheckbox.checked = (checked === total);
            selectAllCheckbox.indeterminate = (checked > 0 && checked < total);
          }
        }
      });

      // Enter key on name input
      document.getElementById('studentNameInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          document.getElementById('addStudentBtn').click();
        }
      });

      // ---- initial render ----
      renderTable();
      updateDate();
      showToast('👋 Click a student to toggle, or add new!');

      // ---- DOWNLOAD HANDLERS (three separate files, no download button in UI) ----
      // We'll attach download functions to the window so they can be called from console or external buttons
      // But we'll also create a small hidden download helper
      window.downloadFiles = function() {
        const styleContent = document.querySelector('style').textContent;
        const scriptContent = document.querySelector('script:last-of-type').textContent;
        const htmlContent = document.documentElement.outerHTML;

        function downloadFile(filename, content, mime = 'text/plain') {
          const blob = new Blob([content], { type: mime });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }

        // download all three
        downloadFile('index.html', htmlContent, 'text/html');
        setTimeout(() => downloadFile('style.css', styleContent, 'text/css'), 200);
        setTimeout(() => downloadFile('script.js', scriptContent, 'application/javascript'), 400);
        showToast('📦 Downloading 3 files...');
      };

      // Also expose individual downloads
      window.downloadHTML = function() {
        const content = document.documentElement.outerHTML;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('⬇️ Downloaded index.html');
      };

      window.downloadCSS = function() {
        const content = document.querySelector('style').textContent;
        const blob = new Blob([content], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'style.css';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('⬇️ Downloaded style.css');
      };

      window.downloadJS = function() {
        const content = document.querySelector('script:last-of-type').textContent;
        const blob = new Blob([content], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'script.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('⬇️ Downloaded script.js');
      };

      // Show download instructions in console
      console.log('%c📥 Download files:', 'font-weight:bold; font-size:16px;');
      console.log('  downloadHTML()  - download index.html');
      console.log('  downloadCSS()   - download style.css');
      console.log('  downloadJS()    - download script.js');
      console.log('  downloadFiles() - download all three');
      console.log('You can run these in the console to download the files.');

      // Also add keyboard shortcut: Ctrl+Shift+D to download all
      document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          window.downloadFiles();
        }
      });

      showToast('💡 Press Ctrl+Shift+D to download all files');

    })();
  