<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
        'question',
        'option_a', // Option A
        'option_b', // Option B
        'option_c', // Option C
        'option_d', // Option D
        'correct_answer', // Store the correct answer
        'module_id', // Foreign key to the module
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
